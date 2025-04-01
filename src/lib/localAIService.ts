import axios from 'axios';
import { LocalAIConfig, getLocalConfig } from './localConfig';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaRequest {
  model: string;
  messages: Message[];
  stream?: boolean;
}

interface LMStudioRequest {
  model: string;
  messages: Message[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface AIResponse {
  content: string;
  error?: string;
}

// Helper function to log API requests and responses
function logApiOperation(operation: string, details: any) {
  console.log(`[LocalAI] ${operation}:`, JSON.stringify(details, null, 2));
}

export async function queryLocalAI(prompt: string, systemPrompt?: string): Promise<AIResponse> {
  try {
    const config = getLocalConfig();
    logApiOperation('Config', config);
    
    // Use provided system prompt or fall back to config
    const finalSystemPrompt = systemPrompt || config.systemPrompt || 'You are a helpful AI assistant.';
    
    logApiOperation('Query', { 
      provider: config.provider, 
      endpoint: config.endpoint,
      model: config.model,
      promptLength: prompt.length
    });
    
    switch (config.provider) {
      case 'ollama':
        return await queryOllama(config, prompt, finalSystemPrompt);
      case 'lmstudio':
        return await queryLMStudio(config, prompt, finalSystemPrompt);
      case 'custom':
        return await queryCustomEndpoint(config, prompt, finalSystemPrompt);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  } catch (error) {
    console.error('Error querying local AI:', error);
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function queryOllama(config: LocalAIConfig, prompt: string, systemPrompt: string): Promise<AIResponse> {
  try {
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const request: OllamaRequest = {
      model: config.model,
      messages: messages,
      stream: false
    };

    logApiOperation('Ollama Request', { 
      endpoint: config.endpoint,
      model: config.model,
      messageCount: messages.length
    });

    const response = await axios.post(config.endpoint, request, {
      timeout: 60000, // 60 second timeout
      headers: { 'Content-Type': 'application/json' }
    });
    
    logApiOperation('Ollama Response Status', { 
      status: response.status,
      statusText: response.statusText,
      hasData: !!response.data,
      hasMessage: !!(response.data && response.data.message)
    });
    
    if (response.data && response.data.message) {
      return { content: response.data.message.content };
    } else {
      throw new Error('Unexpected response format from Ollama');
    }
  } catch (error) {
    console.error('Ollama query error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Error communicating with Ollama';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        errorMessage = `Connection refused to Ollama at ${config.endpoint}. Is Ollama running?`;
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = `Connection to Ollama at ${config.endpoint} timed out. Check your network or server status.`;
      } else if (error.response) {
        errorMessage = `Ollama server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = `No response received from Ollama server at ${config.endpoint}`;
      }
    }
    
    return {
      content: '',
      error: errorMessage
    };
  }
}

async function queryLMStudio(config: LocalAIConfig, prompt: string, systemPrompt: string): Promise<AIResponse> {
  try {
    console.log(`LMStudio: Using model ${config.model} at endpoint ${config.endpoint}`);
    
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    // Check if this is a screenshot processing request
    const isScreenshotRequest = prompt.includes("Process these screenshots") || 
                               prompt.includes("analyze this image") || 
                               prompt.includes("look at this screenshot");
    
    // Check if model is multimodal-capable
    const isMultimodalModel = config.model && (
      config.model.includes('llava') || 
      config.model.includes('bakllava') || 
      config.model.includes('vision') ||
      config.model.includes('multimodal') ||
      config.model.includes('clip')
    );
    
    if (isScreenshotRequest && !isMultimodalModel) {
      console.warn(`LMStudio: Attempting to process screenshots with non-multimodal model ${config.model}`);
      console.warn("LMStudio: This will not work well. Please use a multimodal model like LLaVA.");
    }

    // Try completions endpoint first since it's more reliable
    const completionsEndpoint = config.endpoint.replace('/chat/completions', '/completions');
    
    const completionsRequest = {
      model: config.model || 'llama-3.2-3b-instruct',
      prompt: `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`,
      temperature: 0.7,
      max_tokens: 2000, // Reduced from 4000 to improve response time
      stream: false
    };
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }
    
    logApiOperation('LMStudio Request', { 
      endpoint: completionsEndpoint,
      model: config.model,
      promptLength: completionsRequest.prompt.length,
      hasApiKey: !!config.apiKey
    });
    
    console.log(`Sending request to LM Studio at ${completionsEndpoint}`);
    
    try {
      const response = await axios.post(completionsEndpoint, completionsRequest, { 
        headers,
        timeout: 300000 // Increased to 5 minutes (300 seconds) to prevent timeouts
      });
      
      logApiOperation('LMStudio Response', { 
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        hasChoices: !!(response.data && response.data.choices)
      });
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const content = response.data.choices[0].text || response.data.choices[0].content;
        if (content) {
          return { content };
        }
      }
      
      // If completions endpoint doesn't work, try chat endpoint
      console.log('Trying chat endpoint as fallback...');
      
      const chatRequest = {
        model: config.model || 'llama-3.2-3b-instruct',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000, // Reduced from 4000
        stream: false
      };
      
      const chatResponse = await axios.post(config.endpoint, chatRequest, { 
        headers,
        timeout: 300000 // Increased to 5 minutes
      });
      
      if (chatResponse.data && chatResponse.data.choices && chatResponse.data.choices.length > 0) {
        return { content: chatResponse.data.choices[0].message.content };
      }
      
      throw new Error('Could not get valid response from either endpoint');
      
    } catch (error) {
      console.error('LMStudio query error:', error);
      
      let errorMessage = 'Error communicating with LMStudio';
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          errorMessage = `Connection refused. Is LMStudio running at ${completionsEndpoint}?`;
        } else if (error.code === 'ETIMEDOUT') {
          errorMessage = `Request timed out after 5 minutes. The model may be too slow or the request too large.`;
        } else if (error.response) {
          errorMessage = `Server error ${error.response.status}: ${error.response.statusText}`;
          if (error.response.data) {
            errorMessage += `\n${JSON.stringify(error.response.data)}`;
          }
        }
      }
      
      return {
        content: '',
        error: errorMessage
      };
    }
  } catch (error) {
    return {
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function queryCustomEndpoint(config: LocalAIConfig, prompt: string, systemPrompt: string): Promise<AIResponse> {
  try {
    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    // For custom endpoints, we'll try to use a format similar to OpenAI's
    const request = {
      model: config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 4000
    };

    logApiOperation('Custom Endpoint Request', { 
      endpoint: config.endpoint,
      model: config.model,
      messageCount: messages.length,
      hasApiKey: !!config.apiKey
    });

    const response = await axios.post(config.endpoint, request, { 
      headers,
      timeout: 60000 // 60 second timeout
    });
    
    logApiOperation('Custom Endpoint Response', { 
      status: response.status,
      statusText: response.statusText,
      dataType: typeof response.data,
      hasData: !!response.data
    });
    
    // Try to extract content from various possible response formats
    if (response.data) {
      if (response.data.choices && response.data.choices.length > 0 && response.data.choices[0].message) {
        return { content: response.data.choices[0].message.content };
      } else if (response.data.message && response.data.message.content) {
        return { content: response.data.message.content };
      } else if (response.data.content) {
        return { content: response.data.content };
      } else if (typeof response.data === 'string') {
        return { content: response.data };
      }
    }
    
    throw new Error('Could not parse response from custom endpoint');
  } catch (error) {
    console.error('Custom endpoint query error:', error);
    
    // Provide more detailed error information
    let errorMessage = 'Error communicating with custom endpoint';
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        errorMessage = `Connection refused to endpoint at ${config.endpoint}. Is the server running?`;
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = `Connection to endpoint at ${config.endpoint} timed out. Check your network or server status.`;
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = `No response received from server at ${config.endpoint}`;
      }
    }
    
    return {
      content: '',
      error: errorMessage
    };
  }
} 