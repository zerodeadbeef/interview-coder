"use strict";
// ipcHandlers.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeIpcHandlers = initializeIpcHandlers;
const electron_1 = require("electron");
const crypto_1 = require("crypto");
const axios_1 = __importDefault(require("axios"));
function initializeIpcHandlers(deps) {
    console.log("Initializing IPC handlers");
    // Window management handlers
    electron_1.ipcMain.handle("update-content-dimensions", (_event, dimensions) => {
        deps.setWindowDimensions(dimensions.width, dimensions.height);
    });
    // Local AI handlers
    electron_1.ipcMain.handle("test-local-ai", async (_event, config) => {
        try {
            // Simple test prompt to check if the AI service is working
            const testPrompt = "Say 'Hello, I am working correctly!' if you can read this message.";
            let response;
            if (config.provider === 'ollama') {
                // Test Ollama connection
                response = await axios_1.default.post(config.endpoint, {
                    model: config.model,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: testPrompt }
                    ],
                    stream: false
                });
                if (response.data && response.data.message && response.data.message.content) {
                    return { success: true, message: response.data.message.content };
                }
                else {
                    return { success: false, error: 'Unexpected response format from Ollama' };
                }
            }
            else if (config.provider === 'lmstudio') {
                // Test LMStudio connection
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (config.apiKey) {
                    headers['Authorization'] = `Bearer ${config.apiKey}`;
                }
                response = await axios_1.default.post(config.endpoint, {
                    model: config.model,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: testPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                }, { headers });
                if (response.data && response.data.choices && response.data.choices.length > 0) {
                    return { success: true, message: response.data.choices[0].message.content };
                }
                else {
                    return { success: false, error: 'Unexpected response format from LMStudio' };
                }
            }
            else if (config.provider === 'custom') {
                // Test custom endpoint
                const headers = {
                    'Content-Type': 'application/json'
                };
                if (config.apiKey) {
                    headers['Authorization'] = `Bearer ${config.apiKey}`;
                }
                response = await axios_1.default.post(config.endpoint, {
                    model: config.model,
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: testPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                }, { headers });
                // Try to extract content from various possible response formats
                if (response.data) {
                    if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
                        return { success: true, message: response.data.choices[0].message.content };
                    }
                    else if (response.data.message && response.data.message.content) {
                        return { success: true, message: response.data.message.content };
                    }
                    else if (response.data.content) {
                        return { success: true, message: response.data.content };
                    }
                    else if (typeof response.data === 'string') {
                        return { success: true, message: response.data };
                    }
                }
                return { success: false, error: 'Could not parse response from custom endpoint' };
            }
            else {
                return { success: false, error: `Unsupported provider: ${config.provider}` };
            }
        }
        catch (error) {
            console.error('Error testing local AI:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    });
    electron_1.ipcMain.handle("get-screenshot-queue", () => {
        return deps.getScreenshotQueue();
    });
    electron_1.ipcMain.handle("get-extra-screenshot-queue", () => {
        return deps.getExtraScreenshotQueue();
    });
    electron_1.ipcMain.handle("delete-screenshot", async (event, path) => {
        return deps.deleteScreenshot(path);
    });
    electron_1.ipcMain.handle("get-image-preview", async (event, path) => {
        return deps.getImagePreview(path);
    });
    // Screenshot processing handlers
    electron_1.ipcMain.handle("process-screenshots", async () => {
        await deps.processingHelper?.processScreenshots();
    });
    // Screenshot management handlers
    electron_1.ipcMain.handle("get-screenshots", async () => {
        try {
            let previews = [];
            const currentView = deps.getView();
            if (currentView === "queue") {
                const queue = deps.getScreenshotQueue();
                previews = await Promise.all(queue.map(async (path) => ({
                    path,
                    preview: await deps.getImagePreview(path)
                })));
            }
            else {
                const extraQueue = deps.getExtraScreenshotQueue();
                previews = await Promise.all(extraQueue.map(async (path) => ({
                    path,
                    preview: await deps.getImagePreview(path)
                })));
            }
            return previews;
        }
        catch (error) {
            console.error("Error getting screenshots:", error);
            throw error;
        }
    });
    // Screenshot trigger handlers
    electron_1.ipcMain.handle("trigger-screenshot", async () => {
        const mainWindow = deps.getMainWindow();
        if (mainWindow) {
            try {
                const screenshotPath = await deps.takeScreenshot();
                const preview = await deps.getImagePreview(screenshotPath);
                mainWindow.webContents.send("screenshot-taken", {
                    path: screenshotPath,
                    preview
                });
                return { success: true };
            }
            catch (error) {
                console.error("Error triggering screenshot:", error);
                return { error: "Failed to trigger screenshot" };
            }
        }
        return { error: "No main window available" };
    });
    electron_1.ipcMain.handle("take-screenshot", async () => {
        try {
            const screenshotPath = await deps.takeScreenshot();
            const preview = await deps.getImagePreview(screenshotPath);
            return { path: screenshotPath, preview };
        }
        catch (error) {
            console.error("Error taking screenshot:", error);
            return { error: "Failed to take screenshot" };
        }
    });
    // Auth related handlers
    electron_1.ipcMain.handle("get-pkce-verifier", () => {
        return (0, crypto_1.randomBytes)(32).toString("base64url");
    });
    electron_1.ipcMain.handle("open-external-url", (event, url) => {
        electron_1.shell.openExternal(url);
    });
    // Subscription handlers
    electron_1.ipcMain.handle("open-settings-portal", () => {
        electron_1.shell.openExternal("https://www.interviewcoder.co/settings");
    });
    // Window management handlers
    electron_1.ipcMain.handle("toggle-window", () => {
        try {
            deps.toggleMainWindow();
            return { success: true };
        }
        catch (error) {
            console.error("Error toggling window:", error);
            return { error: "Failed to toggle window" };
        }
    });
    electron_1.ipcMain.handle("reset-queues", async () => {
        try {
            deps.clearQueues();
            return { success: true };
        }
        catch (error) {
            console.error("Error resetting queues:", error);
            return { error: "Failed to reset queues" };
        }
    });
    // Process screenshot handlers
    electron_1.ipcMain.handle("trigger-process-screenshots", async () => {
        try {
            await deps.processingHelper?.processScreenshots();
            return { success: true };
        }
        catch (error) {
            console.error("Error processing screenshots:", error);
            return { error: "Failed to process screenshots" };
        }
    });
    // Reset handlers
    electron_1.ipcMain.handle("trigger-reset", () => {
        try {
            // First cancel any ongoing requests
            deps.processingHelper?.cancelOngoingRequests();
            // Clear all queues immediately
            deps.clearQueues();
            // Reset view to queue
            deps.setView("queue");
            // Get main window and send reset events
            const mainWindow = deps.getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                // Send reset events in sequence
                mainWindow.webContents.send("reset-view");
                mainWindow.webContents.send("reset");
            }
            return { success: true };
        }
        catch (error) {
            console.error("Error triggering reset:", error);
            return { error: "Failed to trigger reset" };
        }
    });
    // Window movement handlers
    electron_1.ipcMain.handle("trigger-move-left", () => {
        try {
            deps.moveWindowLeft();
            return { success: true };
        }
        catch (error) {
            console.error("Error moving window left:", error);
            return { error: "Failed to move window left" };
        }
    });
    electron_1.ipcMain.handle("trigger-move-right", () => {
        try {
            deps.moveWindowRight();
            return { success: true };
        }
        catch (error) {
            console.error("Error moving window right:", error);
            return { error: "Failed to move window right" };
        }
    });
    electron_1.ipcMain.handle("trigger-move-up", () => {
        try {
            deps.moveWindowUp();
            return { success: true };
        }
        catch (error) {
            console.error("Error moving window up:", error);
            return { error: "Failed to move window up" };
        }
    });
    electron_1.ipcMain.handle("trigger-move-down", () => {
        try {
            deps.moveWindowDown();
            return { success: true };
        }
        catch (error) {
            console.error("Error moving window down:", error);
            return { error: "Failed to move window down" };
        }
    });
    // Add this to the initializeIpcHandlers function
    electron_1.ipcMain.handle("test-local-ai-connection", async (_event, config) => {
        console.log("Testing local AI connection with config:", config);
        try {
            // Test the connection based on the provider
            if (config.provider === 'lmstudio') {
                // First, try to get the models list
                try {
                    const baseUrl = config.endpoint.split('/v1')[0];
                    const modelsUrl = `${baseUrl}/v1/models`;
                    console.log(`Testing LM Studio models endpoint: ${modelsUrl}`);
                    const modelsResponse = await axios_1.default.get(modelsUrl, {
                        timeout: 5000,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    console.log("LM Studio models response:", modelsResponse.data);
                    // Now test the chat endpoint
                    const chatResponse = await axios_1.default.post(config.endpoint, {
                        model: config.model || "llama-3.2-3b-instruct",
                        messages: [
                            { role: 'system', content: 'You are a helpful assistant.' },
                            { role: 'user', content: 'Say hello' }
                        ],
                        temperature: 0.7,
                        max_tokens: 100
                    }, {
                        timeout: 30000,
                        headers: { 'Content-Type': 'application/json' }
                    });
                    console.log("LM Studio chat response:", chatResponse.data);
                    return {
                        success: true,
                        message: "Successfully connected to LM Studio",
                        models: modelsResponse.data,
                        response: chatResponse.data
                    };
                }
                catch (error) {
                    console.error("Error testing LM Studio connection:", error);
                    // Try alternative endpoint
                    if (config.endpoint.includes('/v1/chat/completions')) {
                        try {
                            const alternativeEndpoint = config.endpoint.replace('/v1/chat/completions', '/v1/completions');
                            console.log(`Trying alternative endpoint: ${alternativeEndpoint}`);
                            const altResponse = await axios_1.default.post(alternativeEndpoint, {
                                model: config.model || "llama-3.2-3b-instruct",
                                prompt: "You are a helpful assistant.\n\nUser: Say hello\n\nAssistant:",
                                temperature: 0.7,
                                max_tokens: 100
                            }, {
                                timeout: 10000,
                                headers: { 'Content-Type': 'application/json' }
                            });
                            console.log("Alternative endpoint response:", altResponse.data);
                            return {
                                success: true,
                                message: "Successfully connected to LM Studio using alternative endpoint",
                                response: altResponse.data
                            };
                        }
                        catch (altError) {
                            console.error("Error with alternative endpoint:", altError);
                            throw error; // Throw the original error
                        }
                    }
                    else {
                        throw error;
                    }
                }
            }
            else if (config.provider === 'ollama') {
                // Test Ollama connection
                const response = await axios_1.default.post(config.endpoint, {
                    model: config.model || "llama3",
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: 'Say hello' }
                    ],
                    stream: false
                }, {
                    timeout: 10000,
                    headers: { 'Content-Type': 'application/json' }
                });
                console.log("Ollama response:", response.data);
                return {
                    success: true,
                    message: "Successfully connected to Ollama",
                    response: response.data
                };
            }
            else {
                // Test custom endpoint
                const response = await axios_1.default.post(config.endpoint, {
                    model: config.model || "model",
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: 'Say hello' }
                    ],
                    temperature: 0.7,
                    max_tokens: 100
                }, {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {})
                    }
                });
                console.log("Custom endpoint response:", response.data);
                return {
                    success: true,
                    message: "Successfully connected to custom endpoint",
                    response: response.data
                };
            }
        }
        catch (error) {
            console.error("Error testing local AI connection:", error);
            let errorMessage = "Failed to connect to local AI service";
            if (axios_1.default.isAxiosError(error)) {
                if (error.code === 'ECONNREFUSED') {
                    errorMessage = `Connection refused. Is the ${config.provider} server running?`;
                }
                else if (error.code === 'ETIMEDOUT') {
                    errorMessage = `Connection timed out. Check your network or server status.`;
                }
                else if (error.response) {
                    errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
                    if (error.response.data) {
                        errorMessage += `\nResponse: ${JSON.stringify(error.response.data)}`;
                    }
                }
                else if (error.request) {
                    errorMessage = `No response received from server`;
                }
            }
            return {
                success: false,
                error: errorMessage
            };
        }
    });
}
