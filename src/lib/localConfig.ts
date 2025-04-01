// Local AI Configuration
export interface LocalAIConfig {
  provider: string;
  endpoint: string;
  model: string;
  systemPrompt?: string;
  apiKey?: string;
  connectionType?: 'manual' | 'scan';
  isActive: boolean;
  activeModel?: string;
}

// Model information
export interface AIModel {
  id: string;
  name: string;
  provider: 'lmstudio' | 'ollama' | 'custom' | 'api';
  endpoint: string;
  isMultimodal: boolean;
  isActive: boolean;
}

// Default configuration
export const defaultLocalConfig: LocalAIConfig = {
  provider: '',
  endpoint: '',
  model: '',
  systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.',
  isActive: false
};

// Get the current configuration
export function getLocalConfig(): LocalAIConfig {
  try {
    const config = localStorage.getItem('localAIConfig');
    if (!config) {
      return {
        provider: '',
        endpoint: '',
        model: '',
        systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.',
        isActive: false
      };
    }
    return JSON.parse(config);
  } catch (error) {
    console.error('Error getting local config:', error);
    return {
      provider: '',
      endpoint: '',
      model: '',
      systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.',
      isActive: false
    };
  }
}

// Save the configuration
export function saveLocalConfig(config: LocalAIConfig): void {
  try {
    localStorage.setItem('localAIConfig', JSON.stringify(config));
  } catch (error) {
    console.error('Error saving local config:', error);
  }
}

// Get saved AI models
export function getSavedModels(): AIModel[] {
  try {
    const savedModels = localStorage.getItem('savedAIModels');
    return savedModels ? JSON.parse(savedModels) : [];
  } catch (error) {
    console.error('Error getting saved models:', error);
    return [];
  }
}

// Save AI models
export function saveAIModels(models: AIModel[]): void {
  try {
    localStorage.setItem('savedAIModels', JSON.stringify(models));
  } catch (error) {
    console.error('Error saving models:', error);
  }
}

// Sync local AI service with saved settings
export function syncLocalAIService(): void {
  const config = getLocalConfig();
  const activeModel = getActiveModel();
  
  if (activeModel && config.isActive) {
    // Update the config with active model details
    const updatedConfig = {
      ...config,
      provider: activeModel.provider,
      endpoint: activeModel.endpoint,
      model: activeModel.id,
      activeModel: activeModel.id,
      isActive: true
    };
    saveLocalConfig(updatedConfig);
  }
}

// Set active model
export function setActiveModel(modelId: string): void {
  try {
    const models = getSavedModels();
    const updatedModels = models.map(model => ({
      ...model,
      isActive: model.id === modelId
    }));
    
    // Save updated models
    saveAIModels(updatedModels);
    
    // Get the active model
    const activeModel = updatedModels.find(model => model.id === modelId);
    if (activeModel) {
      // Update local config with active model details
      const config = getLocalConfig();
      const updatedConfig: LocalAIConfig = {
        ...config,
        provider: activeModel.provider,
        endpoint: activeModel.endpoint,
        model: activeModel.id,
        activeModel: activeModel.id,
        isActive: true
      };
      saveLocalConfig(updatedConfig);
    }
  } catch (error) {
    console.error('Error setting active model:', error);
  }
}

// Get active model
export function getActiveModel(): AIModel | null {
  try {
    const models = getSavedModels();
    const activeModel = models.find(model => model.isActive) || null;
    
    // If no active model but we have a config with an active model ID, try to set it
    if (!activeModel) {
      const config = getLocalConfig();
      if (config.activeModel) {
        const model = models.find(m => m.id === config.activeModel) || null;
        if (model) {
          setActiveModel(model.id);
          return model;
        }
      }
    }
    
    return activeModel;
  } catch (error) {
    console.error('Error getting active model:', error);
    return null;
  }
}

// Add new model and optionally set as active
export function addNewModel(model: AIModel, setAsActive: boolean = true): void {
  const models = getSavedModels();
  
  // Check if model already exists
  const existingModel = models.find(m => 
    m.endpoint === model.endpoint && 
    m.provider === model.provider
  );
  
  if (!existingModel) {
    // If setting as active, deactivate all others
    const updatedModels = setAsActive 
      ? models.map(m => ({...m, isActive: false}))
      : [...models];
    
    // Add the new model
    const newModel = {...model, isActive: setAsActive};
    updatedModels.push(newModel);
    
    // Save models
    saveAIModels(updatedModels);
    
    // If setting as active, update config
    if (setAsActive) {
      const config = getLocalConfig();
      saveLocalConfig({
        ...config,
        provider: model.provider,
        endpoint: model.endpoint,
        model: model.id,
        activeModel: model.id,
        isActive: true
      });
      
      // Sync service
      syncLocalAIService();
    }
  }
}

// LMStudio default configuration
export const lmStudioConfig: LocalAIConfig = {
  provider: 'lmstudio',
  endpoint: 'http://127.0.0.1:1234/v1/chat/completions',
  model: 'llama-3.2-3b-instruct',
  systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.'
};

// LMStudio remote configuration (for the specific setup in the logs)
export const lmStudioRemoteConfig: LocalAIConfig = {
  provider: 'lmstudio',
  endpoint: 'http://192.168.100.182:1234/v1/chat/completions',
  model: 'llama-3.2-3b-instruct',
  systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.'
};

// Ollama default configuration
export const ollamaConfig: LocalAIConfig = {
  provider: 'ollama',
  endpoint: 'http://localhost:11434/api/chat',
  model: 'llama3',
  systemPrompt: 'You are an AI assistant that helps solve coding interview problems. Analyze the problem and provide a clear, efficient solution with explanations.'
}; 