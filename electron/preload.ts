console.log("Preload script starting...")
import { contextBridge, ipcRenderer } from "electron"
const { shell } = require("electron")

// Types for the exposed Electron API
interface ElectronAPI {
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  clearStore: () => Promise<{ success: boolean; error?: string }>
  getScreenshots: () => Promise<{
    success: boolean
    previews?: Array<{ path: string; preview: string }> | null
    error?: string
  }>
  deleteScreenshot: (
    path: string
  ) => Promise<{ success: boolean; error?: string }>
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => () => void
  onResetView: (callback: () => void) => () => void
  onSolutionStart: (callback: () => void) => () => void
  onDebugStart: (callback: () => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  openExternal: (url: string) => void
  toggleMainWindow: () => Promise<{ success: boolean; error?: string }>
  triggerScreenshot: () => Promise<{ success: boolean; error?: string }>
  triggerProcessScreenshots: () => Promise<{ success: boolean; error?: string }>
  triggerReset: () => Promise<{ success: boolean; error?: string }>
  triggerMoveLeft: () => Promise<{ success: boolean; error?: string }>
  triggerMoveRight: () => Promise<{ success: boolean; error?: string }>
  triggerMoveUp: () => Promise<{ success: boolean; error?: string }>
  triggerMoveDown: () => Promise<{ success: boolean; error?: string }>
  startUpdate: () => Promise<{ success: boolean; error?: string }>
  installUpdate: () => void
  onUpdateAvailable: (callback: (info: any) => void) => () => void
  onUpdateDownloaded: (callback: (info: any) => void) => () => void
  getPlatform: () => string
  testLocalAI: (config: any) => Promise<{ success: boolean; message?: string; error?: string }>
  testLocalAIConnection: (config: any) => Promise<{ 
    success: boolean; 
    message?: string; 
    error?: string;
    models?: any;
    response?: any;
  }>
}

export const PROCESSING_EVENTS = {
  //global states
  NO_SCREENSHOTS: "processing-no-screenshots",

  //states for generating the initial solution
  INITIAL_START: "initial-start",
  PROBLEM_EXTRACTED: "problem-extracted",
  SOLUTION_SUCCESS: "solution-success",
  INITIAL_SOLUTION_ERROR: "solution-error",
  RESET: "reset",

  //states for processing the debugging
  DEBUG_START: "debug-start",
  DEBUG_SUCCESS: "debug-success",
  DEBUG_ERROR: "debug-error"
} as const

// At the top of the file
console.log("Preload script is running")

const electronAPI = {
  updateContentDimensions: (dimensions: { width: number; height: number }) =>
    ipcRenderer.invoke("update-content-dimensions", dimensions),
  clearStore: () => ipcRenderer.invoke("clear-store"),
  getScreenshots: () => ipcRenderer.invoke("get-screenshots"),
  deleteScreenshot: (path: string) =>
    ipcRenderer.invoke("delete-screenshot", path),
  toggleMainWindow: async () => {
    console.log("toggleMainWindow called from preload")
    try {
      const result = await ipcRenderer.invoke("toggle-window")
      console.log("toggle-window result:", result)
      return result
    } catch (error) {
      console.error("Error in toggleMainWindow:", error)
      throw error
    }
  },
  // Event listeners
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => {
    const subscription = (_: any, data: { path: string; preview: string }) =>
      callback(data)
    ipcRenderer.on("screenshot-taken", subscription)
    return () => {
      ipcRenderer.removeListener("screenshot-taken", subscription)
    }
  },
  onResetView: (callback: () => void) => {
    const subscription = () => callback()
    ipcRenderer.on("reset-view", subscription)
    return () => {
      ipcRenderer.removeListener("reset-view", subscription)
    }
  },
  onSolutionStart: (callback: () => void) => {
    const subscription = () => callback()
    ipcRenderer.on(PROCESSING_EVENTS.INITIAL_START, subscription)
    return () => {
      ipcRenderer.removeListener(PROCESSING_EVENTS.INITIAL_START, subscription)
    }
  },
  onDebugStart: (callback: () => void) => {
    const subscription = () => callback()
    ipcRenderer.on(PROCESSING_EVENTS.DEBUG_START, subscription)
    return () => {
      ipcRenderer.removeListener(PROCESSING_EVENTS.DEBUG_START, subscription)
    }
  },
  onDebugSuccess: (callback: (data: any) => void) => {
    ipcRenderer.on("debug-success", (_event, data) => callback(data))
    return () => {
      ipcRenderer.removeListener("debug-success", (_event, data) =>
        callback(data)
      )
    }
  },
  onDebugError: (callback: (error: string) => void) => {
    const subscription = (_: any, error: string) => callback(error)
    ipcRenderer.on(PROCESSING_EVENTS.DEBUG_ERROR, subscription)
    return () => {
      ipcRenderer.removeListener(PROCESSING_EVENTS.DEBUG_ERROR, subscription)
    }
  },
  onSolutionError: (callback: (error: string) => void) => {
    const subscription = (_: any, error: string) => callback(error)
    ipcRenderer.on(PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR, subscription)
    return () => {
      ipcRenderer.removeListener(
        PROCESSING_EVENTS.INITIAL_SOLUTION_ERROR,
        subscription
      )
    }
  },
  onProcessingNoScreenshots: (callback: () => void) => {
    const subscription = () => callback()
    ipcRenderer.on(PROCESSING_EVENTS.NO_SCREENSHOTS, subscription)
    return () => {
      ipcRenderer.removeListener(PROCESSING_EVENTS.NO_SCREENSHOTS, subscription)
    }
  },
  onProblemExtracted: (callback: (data: any) => void) => {
    const subscription = (_: any, data: any) => callback(data)
    ipcRenderer.on(PROCESSING_EVENTS.PROBLEM_EXTRACTED, subscription)
    return () => {
      ipcRenderer.removeListener(
        PROCESSING_EVENTS.PROBLEM_EXTRACTED,
        subscription
      )
    }
  },
  onSolutionSuccess: (callback: (data: any) => void) => {
    const subscription = (_: any, data: any) => callback(data)
    ipcRenderer.on(PROCESSING_EVENTS.SOLUTION_SUCCESS, subscription)
    return () => {
      ipcRenderer.removeListener(
        PROCESSING_EVENTS.SOLUTION_SUCCESS,
        subscription
      )
    }
  },
  openExternal: (url: string) => shell.openExternal(url),
  triggerScreenshot: () => ipcRenderer.invoke("trigger-screenshot"),
  triggerProcessScreenshots: () =>
    ipcRenderer.invoke("trigger-process-screenshots"),
  triggerReset: () => ipcRenderer.invoke("trigger-reset"),
  triggerMoveLeft: () => ipcRenderer.invoke("trigger-move-left"),
  triggerMoveRight: () => ipcRenderer.invoke("trigger-move-right"),
  triggerMoveUp: () => ipcRenderer.invoke("trigger-move-up"),
  triggerMoveDown: () => ipcRenderer.invoke("trigger-move-down"),
  startUpdate: () => ipcRenderer.invoke("start-update"),
  installUpdate: () => ipcRenderer.invoke("install-update"),
  onUpdateAvailable: (callback: (info: any) => void) => {
    const subscription = (_: any, info: any) => callback(info)
    ipcRenderer.on("update-available", subscription)
    return () => {
      ipcRenderer.removeListener("update-available", subscription)
    }
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    const subscription = (_: any, info: any) => callback(info)
    ipcRenderer.on("update-downloaded", subscription)
    return () => {
      ipcRenderer.removeListener("update-downloaded", subscription)
    }
  },
  getPlatform: () => process.platform,
  testLocalAI: (config: any) => ipcRenderer.invoke("test-local-ai", config),
  testLocalAIConnection: (config: any) => ipcRenderer.invoke("test-local-ai-connection", config)
} as ElectronAPI

// Before exposing the API
console.log(
  "About to expose electronAPI with methods:",
  Object.keys(electronAPI)
)

// Expose the API
contextBridge.exposeInMainWorld("electronAPI", electronAPI)

console.log("electronAPI exposed to window")

// Add this focus restoration handler
ipcRenderer.on("restore-focus", () => {
  // Try to focus the active element if it exists
  const activeElement = document.activeElement as HTMLElement
  if (activeElement && typeof activeElement.focus === "function") {
    activeElement.focus()
  }
})

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on: (channel: string, func: (...args: any[]) => void) => {
      if (channel === "auth-callback") {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    },
    removeListener: (channel: string, func: (...args: any[]) => void) => {
      if (channel === "auth-callback") {
        ipcRenderer.removeListener(channel, (event, ...args) => func(...args))
      }
    }
  }
})

// Add local AI service to the window object
contextBridge.exposeInMainWorld("localAIService", {
  queryLocalAI: async (prompt: string, imageData?: string) => {
    try {
      console.log("Preload: queryLocalAI called with prompt length:", prompt.length);
      if (imageData) {
        console.log("Preload: imageData provided with length:", imageData.length);
      }
      
      // Get the local AI config from localStorage
      const configStr = localStorage.getItem('localAIConfig');
      if (!configStr) {
        console.error("Preload: No local AI configuration found");
        return { 
          content: '', 
          error: 'No local AI configuration found. Please configure your local AI settings.' 
        };
      }
      
      const config = JSON.parse(configStr);
      
      // Validate the configuration
      if (!config.isActive || !config.endpoint || !config.provider) {
        console.error("Preload: Invalid or inactive AI configuration");
        return {
          content: '',
          error: 'Please select and activate an AI model in settings.'
        };
      }
      
      // Get the active model to ensure we're using the correct settings
      const savedModelsStr = localStorage.getItem('savedAIModels');
      if (savedModelsStr) {
        const savedModels = JSON.parse(savedModelsStr);
        const activeModel = savedModels.find((m: any) => m.isActive);
        if (activeModel) {
          // Update config with active model details
          config.provider = activeModel.provider;
          config.endpoint = activeModel.endpoint;
          config.model = activeModel.id;
          config.activeModel = activeModel.id;
        }
      }
      
      console.log("Preload: Using config provider:", config.provider);
      console.log("Preload: Using config endpoint:", config.endpoint);
      console.log("Preload: Using model:", config.model);
      
      // Prepare the request based on the provider
      let response;
      
      if (config.provider === 'ollama') {
        // Format for Ollama
        const messages = [
          { role: 'system', content: config.systemPrompt || 'You are a helpful assistant.' }
        ];
        
        // If image data is provided, include it in the prompt
        if (imageData) {
          messages.push({ 
            role: 'user', 
            content: `${prompt}\n\nHere is the image data: ${imageData}` 
          });
        } else {
          messages.push({ role: 'user', content: prompt });
        }
        
        console.log("Preload: Sending request to Ollama");
        response = await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: config.model,
            messages: messages,
            stream: false
          })
        });
        
        const data = await response.json();
        console.log("Preload: Received response from Ollama");
        
        if (data.message) {
          return { content: data.message.content };
        } else {
          console.error("Preload: Unexpected response format from Ollama", data);
          return { content: '', error: 'Unexpected response format from Ollama' };
        }
      } else if (config.provider === 'lmstudio') {
        // Format for LM Studio (OpenAI compatible)
        const messages = [
          { role: 'system', content: config.systemPrompt || 'You are a helpful assistant.' }
        ];
        
        // If image data is provided, include it in the prompt
        if (imageData) {
          // Check if the model is multimodal-capable
          const isMultimodalModel = config.model && (
            config.model.includes('llava') || 
            config.model.includes('bakllava') || 
            config.model.includes('vision') ||
            config.model.includes('multimodal') ||
            config.model.includes('clip')
          );
          
          console.log("Preload: Processing screenshot with model:", config.model);
          console.log("Preload: Is model multimodal-capable:", isMultimodalModel);
          
          if (isMultimodalModel) {
            // Format for multimodal models using content array format
            messages.push({
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { 
                  type: 'image_url', 
                  image_url: { 
                    url: `data:image/png;base64,${imageData}`,
                    detail: 'high'
                  }
                }
              ]
            });
            console.log("Preload: Using multimodal format for image data with model:", config.model);
          } else {
            // Fallback for text-only models - warn the user
            console.log("Preload: WARNING - Using text-only model for image processing. This will not work well.");
            console.log("Preload: Please select a multimodal model like LLaVA for better screenshot processing.");
            
            messages.push({ 
              role: 'user', 
              content: `${prompt}\n\nNote: The image could not be processed properly because the selected model (${config.model}) is not multimodal-capable. Please use a vision-capable model like LLaVA instead.` 
            });
          }
        } else {
          messages.push({ role: 'user', content: prompt });
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (config.apiKey) {
          headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        
        console.log("Preload: Sending request to LM Studio at", config.endpoint);
        console.log("Preload: Using model:", config.model);
        
        try {
          response = await fetch(config.endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              model: config.model,
              messages: messages,
              temperature: 0.7,
              max_tokens: 4000
            })
          });
          
          console.log("Preload: Received response from LM Studio with status:", response.status);
          
          const data = await response.json();
          console.log("Preload: Parsed response data");
          
          if (data.choices && data.choices.length > 0) {
            return { content: data.choices[0].message.content };
          } else {
            console.error("Preload: Unexpected response format from LM Studio", data);
            return { content: '', error: 'Unexpected response format from LM Studio' };
          }
        } catch (error) {
          console.error("Preload: Error communicating with LM Studio:", error);
          
          // Try alternative endpoint format
          if (config.endpoint.includes('/v1/chat/completions')) {
            const alternativeEndpoint = config.endpoint.replace('/v1/chat/completions', '/v1/completions');
            console.log("Preload: Trying alternative endpoint:", alternativeEndpoint);
            
            try {
              // For completions endpoint, format is different
              const completionsRequest = {
                model: config.model,
                prompt: `${config.systemPrompt || 'You are a helpful assistant.'}\n\nUser: ${prompt}\n\nAssistant:`,
                temperature: 0.7,
                max_tokens: 4000
              };
              
              const altResponse = await fetch(alternativeEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(completionsRequest)
              });
              
              console.log("Preload: Received response from alternative endpoint with status:", altResponse.status);
              
              const altData = await altResponse.json();
              
              if (altData.choices && altData.choices.length > 0) {
                return { content: altData.choices[0].text || altData.choices[0].content };
              }
            } catch (altError) {
              console.error("Preload: Error with alternative endpoint:", altError);
            }
          }
          
          throw error;
        }
      } else if (config.provider === 'custom') {
        // Format for custom endpoint (try to be flexible)
        const messages = [
          { role: 'system', content: config.systemPrompt || 'You are a helpful assistant.' }
        ];
        
        // If image data is provided, include it in the prompt
        if (imageData) {
          messages.push({ 
            role: 'user', 
            content: `${prompt}\n\nHere is the image data: ${imageData}` 
          });
        } else {
          messages.push({ role: 'user', content: prompt });
        }
        
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (config.apiKey) {
          headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
        
        console.log("Preload: Sending request to custom endpoint");
        response = await fetch(config.endpoint, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            model: config.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 4000
          })
        });
        
        const data = await response.json();
        console.log("Preload: Received response from custom endpoint");
        
        // Try to extract content from various possible response formats
        if (data) {
          if (data.choices && data.choices.length > 0 && data.choices[0].message) {
            return { content: data.choices[0].message.content };
          } else if (data.message && data.message.content) {
            return { content: data.message.content };
          } else if (data.content) {
            return { content: data.content };
          } else if (typeof data === 'string') {
            return { content: data };
          }
        }
        
        console.error("Preload: Could not parse response from custom endpoint", data);
        return { content: '', error: 'Could not parse response from custom endpoint' };
      } else {
        console.error("Preload: Unsupported provider:", config.provider);
        return { content: '', error: `Unsupported provider: ${config.provider}` };
      }
    } catch (error) {
      console.error("Preload: Error in queryLocalAI:", error);
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});
