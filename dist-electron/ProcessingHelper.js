"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingHelper = void 0;
// ProcessingHelper.ts
const node_fs_1 = __importDefault(require("node:fs"));
const axios_1 = __importDefault(require("axios"));
const electron_1 = require("electron");
const isDev = !electron_1.app.isPackaged;
// We'll use local processing instead of remote API
const API_BASE_URL = isDev
    ? "http://127.0.0.1:1234"
    : "http://127.0.0.1:1234";
// Add base URL for models endpoint
const MODELS_BASE_URL = `${API_BASE_URL}/v1`;
// Add retry configuration
const MAX_RETRIES = 3;
const INITIAL_TIMEOUT = 30000; // 30 seconds
const MAX_TIMEOUT = 120000; // 120 seconds
class ProcessingHelper {
    constructor(deps) {
        this.localMode = true; // Default to local mode
        this.abortController = null;
        this.currentTimeout = INITIAL_TIMEOUT;
        // AbortControllers for API requests
        this.currentProcessingAbortController = null;
        this.currentExtraProcessingAbortController = null;
        this.deps = deps;
        this.screenshotHelper = deps.getScreenshotHelper();
    }
    // Set local mode
    setLocalMode(isLocal) {
        this.localMode = isLocal;
    }
    // Get local mode
    getLocalMode() {
        return this.localMode;
    }
    async waitForInitialization(mainWindow) {
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds total
        while (attempts < maxAttempts) {
            const isInitialized = await mainWindow.webContents.executeJavaScript("window.__IS_INITIALIZED__");
            if (isInitialized)
                return;
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
        }
        throw new Error("App failed to initialize after 5 seconds");
    }
    async getLanguage() {
        const mainWindow = this.deps.getMainWindow();
        if (!mainWindow)
            return "python";
        try {
            await this.waitForInitialization(mainWindow);
            const language = await mainWindow.webContents.executeJavaScript("window.__LANGUAGE__");
            if (typeof language !== "string" ||
                language === undefined ||
                language === null) {
                console.warn("Language not properly initialized");
                return "python";
            }
            return language;
        }
        catch (error) {
            console.error("Error getting language:", error);
            return "python";
        }
    }
    async fetchWithRetry(url, options, retryCount = 0) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: this.abortController?.signal
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        }
        catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                throw error;
            }
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})...`);
                this.currentTimeout = Math.min(this.currentTimeout * 2, MAX_TIMEOUT);
                return this.fetchWithRetry(url, options, retryCount + 1);
            }
            throw error;
        }
    }
    async processScreenshots() {
        try {
            this.cancelOngoingRequests();
            this.abortController = new AbortController();
            this.currentTimeout = INITIAL_TIMEOUT;
            const mainWindow = this.deps.getMainWindow();
            if (!mainWindow || mainWindow.isDestroyed()) {
                throw new Error("Main window not available");
            }
            const screenshots = await this.deps.getScreenshots();
            if (!screenshots || screenshots.length === 0) {
                mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.NO_SCREENSHOTS);
                return;
            }
            await this.processScreenshotsHelper(screenshots.map(path => ({
                path,
                data: node_fs_1.default.readFileSync(path).toString('base64')
            })), this.abortController.signal);
        }
        catch (error) {
            console.error("Error processing screenshots:", error);
            const mainWindow = this.deps.getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, error instanceof Error ? error.message : "Unknown error occurred");
            }
        }
        finally {
            this.abortController = null;
        }
    }
    async processScreenshotsHelper(screenshots, signal) {
        const mainWindow = this.deps.getMainWindow();
        if (!mainWindow)
            return;
        try {
            mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.INITIAL_START);
            const configStr = await mainWindow.webContents.executeJavaScript("localStorage.getItem('localAIConfig')");
            const savedModelsStr = await mainWindow.webContents.executeJavaScript("localStorage.getItem('savedAIModels')");
            if (!configStr || !savedModelsStr) {
                throw new Error("No AI configuration found. Please configure your AI settings first.");
            }
            const config = JSON.parse(configStr);
            const savedModels = JSON.parse(savedModelsStr);
            const activeModel = savedModels.find((m) => m.isActive);
            if (!activeModel) {
                throw new Error("No active AI model found. Please select a model in settings.");
            }
            // The prompt for extracting problem information
            const extractPrompt = `I'm going to show you a screenshot of a coding interview problem. Please extract the problem statement, requirements, and any examples provided. Format your response as JSON with the following structure:
      {
        "title": "Problem title if available",
        "description": "Full problem description",
        "examples": [
          {"input": "example input", "output": "example output", "explanation": "explanation if available"}
        ],
        "constraints": ["constraint 1", "constraint 2", ...],
        "difficulty": "easy/medium/hard if mentioned"
      }`;
            // Prepare headers
            const headers = {
                'Content-Type': 'application/json'
            };
            if (config.apiKey) {
                headers['Authorization'] = `Bearer ${config.apiKey}`;
            }
            // Prepare messages array with image data
            const messages = [
                { role: 'system', content: config.systemPrompt || 'You are a helpful assistant.' }
            ];
            // Add screenshot data to messages
            for (const screenshot of screenshots) {
                messages.push({
                    role: 'user',
                    content: [
                        { type: 'text', text: extractPrompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${screenshot.data}`,
                                detail: 'high'
                            }
                        }
                    ]
                });
            }
            console.log("Making request to endpoint:", activeModel.endpoint);
            // Make the request to the chat endpoint
            const response = await this.fetchWithRetry(activeModel.endpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    model: activeModel.id,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 4000,
                    stream: false
                }),
                signal
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Received response:", data);
            // Extract content based on provider response format
            let content = '';
            if (data.choices && data.choices.length > 0) {
                content = data.choices[0].message?.content || data.choices[0].text || '';
            }
            else if (data.message?.content) {
                content = data.message.content;
            }
            // If content is empty, try to extract any useful information from the response
            if (!content) {
                if (data.error) {
                    throw new Error(`AI service error: ${data.error}`);
                }
                // For empty responses, create a default response
                content = JSON.stringify({
                    title: "Problem Analysis",
                    description: "The AI model is still processing the image. Please try again in a moment.",
                    examples: [],
                    constraints: [],
                    difficulty: "unknown"
                });
            }
            try {
                const parsedContent = JSON.parse(content);
                // Send the extracted problem info to the main window
                mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.PROBLEM_EXTRACTED, parsedContent);
                // Store the problem info for later use
                this.deps.setProblemInfo(parsedContent);
                // Set the view to show the problem info
                this.deps.setView("problem");
            }
            catch (error) {
                console.error('Error parsing AI response:', error);
                throw new Error('Failed to parse AI response');
            }
        }
        catch (error) {
            console.error('Error processing screenshots:', error);
            throw error;
        }
    }
    // Modified to use local AI
    async generateSolutionsHelper(signal) {
        const mainWindow = this.deps.getMainWindow();
        if (!mainWindow)
            return;
        try {
            // Get the problem info
            const problemInfo = this.deps.getProblemInfo();
            if (!problemInfo) {
                throw new Error("No problem info available");
            }
            // Get the language
            const language = await this.getLanguage();
            if (this.localMode) {
                // Generate solution using local AI
                const solutionPrompt = `I need a solution to the following coding problem in ${language}:
        
        ${JSON.stringify(problemInfo, null, 2)}
        
        Please provide a detailed solution with the following:
        1. A clear explanation of your approach
        2. The time and space complexity analysis
        3. Well-commented code implementation in ${language}
        4. Step-by-step walkthrough of how the solution works with an example
        
        Format your response as JSON with the following structure:
        {
          "approach": "Detailed explanation of the approach",
          "complexity": {
            "time": "O(n) explanation",
            "space": "O(n) explanation"
          },
          "code": "Your full code implementation with comments",
          "walkthrough": "Step-by-step explanation with an example"
        }`;
                console.log("Calling local AI service for solution generation...");
                // Call the local AI service
                const response = await mainWindow.webContents.executeJavaScript(`window.localAIService.queryLocalAI(${JSON.stringify(solutionPrompt)})`);
                console.log("Solution generation response:", response);
                if (response.error) {
                    throw new Error(`Local AI error: ${response.error}`);
                }
                try {
                    // Try to parse the response as JSON
                    let solution;
                    try {
                        solution = JSON.parse(response.content);
                    }
                    catch (parseError) {
                        console.log("Could not parse solution as JSON, using as plain text");
                        // If we can't parse the response, use it as is
                        solution = {
                            approach: "Generated solution",
                            complexity: {
                                time: "Analysis not available",
                                space: "Analysis not available"
                            },
                            code: response.content,
                            walkthrough: "Walkthrough not available"
                        };
                    }
                    console.log("Generated solution:", solution);
                    // Notify the UI that we've generated a solution
                    mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS, solution);
                    // Set the view to solutions
                    this.deps.setView("solutions");
                }
                catch (parseError) {
                    console.error("Error parsing AI solution response:", parseError);
                    // If we can't parse the response, use it as is
                    const solution = {
                        approach: "Generated solution",
                        complexity: {
                            time: "Analysis not available",
                            space: "Analysis not available"
                        },
                        code: response.content,
                        walkthrough: "Walkthrough not available"
                    };
                    mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS, solution);
                    // Set the view to solutions
                    this.deps.setView("solutions");
                }
            }
            else {
                // Original remote API code
                const response = await axios_1.default.post(`${API_BASE_URL}/api/generate-solution`, {
                    problem: problemInfo,
                    language
                }, { signal });
                if (response.status !== 200) {
                    throw new Error(`API returned status code ${response.status}`);
                }
                // Get the solution
                const solution = response.data;
                // Notify the UI that we've generated a solution
                mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.SOLUTION_SUCCESS, solution);
                // Set the view to solutions
                this.deps.setView("solutions");
            }
        }
        catch (error) {
            console.error("Error in generateSolutionsHelper:", error);
            if (signal.aborted) {
                console.log("Solution generation was cancelled");
                return;
            }
            mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, error instanceof Error ? error.message : "Unknown error");
        }
    }
    // Modified to use local AI
    async processExtraScreenshotsHelper(screenshots, signal) {
        const mainWindow = this.deps.getMainWindow();
        if (!mainWindow)
            return;
        try {
            // Notify the UI that we're starting debug
            mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.DEBUG_START);
            // Get the problem info
            const problemInfo = this.deps.getProblemInfo();
            if (!problemInfo) {
                throw new Error("No problem info available");
            }
            // Get the language
            const language = await this.getLanguage();
            if (this.localMode) {
                // Debug using local AI
                const debugPrompt = `I need help debugging my solution to this coding problem:
        
        Problem: ${JSON.stringify(problemInfo, null, 2)}
        
        I'm getting errors or incorrect results. Here's a screenshot of the error or test case that's failing.
        
        Please analyze what might be wrong and provide:
        1. Identification of the issue
        2. A corrected solution in ${language}
        3. Explanation of what was wrong and how the fix addresses it
        
        Format your response as JSON with the following structure:
        {
          "issue": "Description of the identified issue",
          "fix": "Your corrected code implementation",
          "explanation": "Detailed explanation of the problem and how the fix resolves it"
        }`;
                // Call the local AI service
                const response = await mainWindow.webContents.executeJavaScript(`window.localAIService.queryLocalAI(${JSON.stringify(debugPrompt)}, ${JSON.stringify(screenshots[0].data)})`);
                if (response.error) {
                    throw new Error(`Local AI error: ${response.error}`);
                }
                try {
                    // Try to parse the response as JSON
                    const debugResult = JSON.parse(response.content);
                    // Set that we've debugged
                    this.deps.setHasDebugged(true);
                    // Notify the UI that we've debugged
                    mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS, debugResult);
                }
                catch (parseError) {
                    console.error("Error parsing AI debug response:", parseError);
                    // If we can't parse the response, use it as is
                    const debugResult = {
                        issue: "Analysis of the issue",
                        fix: response.content,
                        explanation: "Detailed explanation not available"
                    };
                    // Set that we've debugged
                    this.deps.setHasDebugged(true);
                    mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS, debugResult);
                }
            }
            else {
                // Original remote API code
                // Prepare the form data
                const formData = new FormData();
                formData.append("language", language);
                formData.append("problem", JSON.stringify(problemInfo));
                // Add the screenshots
                screenshots.forEach((screenshot, index) => {
                    formData.append(`image${index + 1}`, screenshot.data);
                });
                // Make the API request
                const response = await axios_1.default.post(`${API_BASE_URL}/api/debug-solution`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    signal
                });
                // Check if the request was successful
                if (response.status !== 200) {
                    throw new Error(`API returned status code ${response.status}`);
                }
                // Get the debug result
                const debugResult = response.data;
                // Set that we've debugged
                this.deps.setHasDebugged(true);
                // Notify the UI that we've debugged
                mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.DEBUG_SUCCESS, debugResult);
            }
        }
        catch (error) {
            console.error("Error in processExtraScreenshotsHelper:", error);
            if (signal.aborted) {
                console.log("Debug was cancelled");
                return;
            }
            mainWindow.webContents.send(this.deps.PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, error instanceof Error ? error.message : "Unknown error");
        }
    }
    cancelOngoingRequests() {
        if (this.currentProcessingAbortController) {
            this.currentProcessingAbortController.abort();
            this.currentProcessingAbortController = null;
        }
        if (this.currentExtraProcessingAbortController) {
            this.currentExtraProcessingAbortController.abort();
            this.currentExtraProcessingAbortController = null;
        }
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }
}
exports.ProcessingHelper = ProcessingHelper;
