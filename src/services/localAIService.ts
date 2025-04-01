import { LocalAIConfig, getLocalConfig, getActiveModel } from '../lib/localConfig';
import { detectAllServers, getBestConfig } from '../lib/serverDetection';

// Define the interface for the response from the AI service
interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// Define the interface for the chat message
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{type: string, [key: string]: any}>;
}

/**
 * Service for interacting with local AI models
 */
export class LocalAIService {
  private static instance: LocalAIService;
  private config: LocalAIConfig;
  private isInitialized: boolean = false;
  private isMultimodalModel: boolean = false;
  
  private constructor() {
    this.config = getLocalConfig();
    this.initializeService();
  }

  public static getInstance(): LocalAIService {
    if (!LocalAIService.instance) {
      LocalAIService.instance = new LocalAIService();
    }
    return LocalAIService.instance;
  }

  private initializeService() {
    if (this.isInitialized) return;

    // Load initial configuration
    this.config = getLocalConfig();
    const activeModel = getActiveModel();
    
    if (activeModel && this.config.isActive) {
      this.config = {
        ...this.config,
        provider: activeModel.provider,
        endpoint: activeModel.endpoint,
        model: activeModel.id,
        activeModel: activeModel.id
      };
    }

    // Listen for configuration changes
    window.addEventListener('localAIConfigChanged', ((event: CustomEvent<LocalAIConfig>) => {
      this.config = event.detail;
    }) as EventListener);

    this.isInitialized = true;
  }
  
  /**
   * Check if the current model is likely a multimodal model
   */
  private checkIfMultimodalModel(): void {
    const modelName = this.config.model.toLowerCase();
    this.isMultimodalModel = 
      modelName.includes('llava') || 
      modelName.includes('bakllava') || 
      modelName.includes('vision') ||
      modelName.includes('multimodal') ||
      modelName.includes('clip');
    
    console.log(`Model ${this.config.model} multimodal capability: ${this.isMultimodalModel}`);
  }
  
  /**
   * Update the configuration
   */
  public updateConfig(newConfig: LocalAIConfig): void {
    this.config = newConfig;
    this.checkIfMultimodalModel();
  }
  
  /**
   * Get the current configuration
   */
  public getConfig(): LocalAIConfig {
    return this.config;
  }
  
  /**
   * Check if the current model supports multimodal inputs
   */
  public supportsMultimodal(): boolean {
    return this.isMultimodalModel;
  }
  
  /**
   * Auto-detect AI servers and update configuration
   */
  public async detectServers(): Promise<AIResponse> {
    try {
      console.log("Detecting AI servers...");
      
      // Use the improved server detection utility
      const result = await detectAllServers(true); // Stop after finding the first server
      
      if (result.success && result.servers.length > 0) {
        // Get the best configuration
        const bestConfig = getBestConfig(result);
        
        if (bestConfig) {
          // Update the configuration
          this.config = {
            ...this.config,
            provider: bestConfig.provider,
            endpoint: bestConfig.endpoint,
            model: bestConfig.model || this.config.model
          };
          
          // Check if the model is multimodal
          this.checkIfMultimodalModel();
          
          return {
            success: true,
            message: `Found ${result.servers[0].type} server at ${result.servers[0].baseUrl}`,
            data: result.servers
          };
        }
      }
      
      return {
        success: false,
        error: result.message
      };
    } catch (error) {
      console.error("Error detecting servers:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Send a chat message to the AI model
   */
  public async sendChatMessage(messages: ChatMessage[]): Promise<AIResponse> {
    try {
      console.log(`Sending chat message to ${this.config.provider} at ${this.config.endpoint}`);
      console.log(`Using model: ${this.config.model}`);
      
      // Check if we're using a multimodal model and have image content
      const hasImageContent = messages.some(msg => 
        Array.isArray(msg.content) && 
        msg.content.some(item => item.type === 'image_url')
      );
      
      if (hasImageContent) {
        console.log("Message contains image content");
        
        // If we have image content but not a multimodal model, warn the user
        if (!this.isMultimodalModel) {
          console.warn("Attempting to send image to non-multimodal model");
          return {
            success: false,
            error: `Model ${this.config.model} does not support images. Please select a multimodal model like LLaVA.`
          };
        }
      }
      
      // Prepare the request based on the provider
      let requestBody: any;
      let headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      
      if (this.config.apiKey) {
        headers['Authorization'] = `Bearer ${this.config.apiKey}`;
      }
      
      if (this.config.provider === 'ollama') {
        // Ollama format
        requestBody = {
          model: this.config.model,
          messages: messages,
          stream: false
        };
      } else {
        // LM Studio and others (OpenAI compatible format)
        requestBody = {
          model: this.config.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        };
      }
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      
      // Send the request
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from AI service: ${response.status} ${errorText}`);
        return {
          success: false,
          error: `Error ${response.status}: ${errorText}`
        };
      }
      
      const data = await response.json();
      console.log("Response from AI service:", data);
      
      // Extract the response based on the provider
      let content = '';
      
      if (this.config.provider === 'ollama') {
        content = data.message?.content || '';
      } else {
        // LM Studio and others (OpenAI compatible format)
        content = data.choices?.[0]?.message?.content || '';
      }
      
      return {
        success: true,
        message: content,
        data: data
      };
    } catch (error) {
      console.error("Error sending chat message:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Process a screenshot with the AI model
   */
  public async processScreenshot(
    base64Image: string, 
    prompt: string
  ): Promise<AIResponse> {
    try {
      console.log(`Processing screenshot with ${this.config.provider} model: ${this.config.model}`);
      
      // Check if the model supports multimodal inputs
      if (!this.isMultimodalModel) {
        console.error(`Model ${this.config.model} does not support multimodal inputs`);
        return {
          success: false,
          error: `Model ${this.config.model} does not support images. Please select a multimodal model like LLaVA.`
        };
      }
      
      // Prepare the messages with the image
      const messages: ChatMessage[] = [
        {
          role: 'system',
          content: this.config.systemPrompt || 'You are a helpful assistant that can analyze images.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: 'text',
              text: prompt || 'What do you see in this image?'
            }
          ]
        }
      ];
      
      // Send the message to the AI model
      return await this.sendChatMessage(messages);
    } catch (error) {
      console.error("Error processing screenshot:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Test the connection to the AI service
   */
  public async testConnection(): Promise<AIResponse> {
    try {
      console.log(`Testing connection to ${this.config.provider} at ${this.config.endpoint}`);
      
      // For Ollama, we'll use the /api/tags endpoint
      if (this.config.provider === 'ollama') {
        const baseUrl = this.config.endpoint.replace('/api/chat', '');
        const response = await fetch(`${baseUrl}/api/tags`, {
          method: 'GET',
          headers: this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          return {
            success: false,
            error: `Error ${response.status}: ${errorText}`
          };
        }
        
        const data = await response.json();
        return {
          success: true,
          message: `Connected to Ollama with ${data.models?.length || 0} models`,
          data: data
        };
      }
      
      // For LM Studio and others, we'll use the /models endpoint
      const baseUrl = this.config.endpoint.replace('/v1/chat/completions', '').replace('/v1/completions', '');
      const response = await fetch(`${baseUrl}/v1/models`, {
        method: 'GET',
        headers: this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {}
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Error ${response.status}: ${errorText}`
        };
      }
      
      const data = await response.json();
      
      // Check if the model exists
      const modelExists = data.data?.some((model: any) => model.id === this.config.model);
      
      return {
        success: true,
        message: modelExists 
          ? `Connected successfully. Model ${this.config.model} is available.` 
          : `Connected successfully, but model ${this.config.model} was not found.`,
        data: data
      };
    } catch (error) {
      console.error("Error testing connection:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Check if the service is properly configured
   */
  public isConfigured(): boolean {
    return this.config.isActive && !!this.config.endpoint && !!this.config.provider;
  }
}

// Export a singleton instance
export const localAIService = LocalAIService.getInstance(); 