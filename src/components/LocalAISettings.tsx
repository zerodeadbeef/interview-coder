import React, { useState, useEffect } from 'react';
import { 
  detectAllServers, 
  getBestConfig, 
  smartNetworkScan, 
  detectLocalDeviceServers,
  CustomPortConfig,
  testCustomAIConnection,
  addAIModel,
  checkAllConnections,
  DEFAULT_ENDPOINTS,
  DEFAULT_CHAT_ENDPOINTS,
  COMMON_AI_PORTS
} from '../lib/serverDetection';
import { 
  LocalAIConfig, 
  getLocalConfig, 
  saveLocalConfig, 
  AIModel,
  getActiveModel,
  getSavedModels,
  setActiveModel,
  syncLocalAIService,
  addNewModel,
  saveAIModels
} from '../lib/localConfig';
import { COMMAND_KEY } from '../utils/platform';

interface LocalAISettingsProps {
  onClose?: () => void;
}

// Tab options for different connection methods
type ConnectionTab = 'scan' | 'custom' | 'api' | 'models';

const LocalAISettings: React.FC<LocalAISettingsProps> = ({ onClose }) => {
  // Initialize with existing config
  const initialConfig = getLocalConfig();
  const [config, setConfig] = useState<LocalAIConfig>(initialConfig);
  
  // UI state
  const [activeTab, setActiveTab] = useState<ConnectionTab>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [testStatus, setTestStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  
  // Models and endpoints
  const [savedModels, setSavedModels] = useState<AIModel[]>([]);
  const [activeModel, setActiveModelState] = useState<AIModel | null>(null);
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  // Custom config state
  const [customName, setCustomName] = useState('');
  const [customIP, setCustomIP] = useState('localhost');
  const [customPort, setCustomPort] = useState('');
  const [customType, setCustomType] = useState<'lmstudio' | 'ollama' | 'custom' | 'api'>('lmstudio');
  const [customModelName, setCustomModelName] = useState('');
  
  // API integration state
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiModelName, setApiModelName] = useState('');

  // Load saved models and sync on mount
  useEffect(() => {
    const loadSavedSettings = () => {
      const models = getSavedModels();
      setSavedModels(models);
      
      const active = getActiveModel();
      if (active) {
        setActiveModelState(active);
        setSelectedModelId(active.id);
        
        // Ensure config is in sync
        const currentConfig = getLocalConfig();
        if (currentConfig.activeModel !== active.id) {
          setActiveModel(active.id);
        }
      } else if (models.length > 0) {
        // If no active model but we have models, set the first one active
        setActiveModel(models[0].id);
        setActiveModelState(models[0]);
        setSelectedModelId(models[0].id);
      }
      
      // Sync with LocalAIService
      syncLocalAIService();
    };

    loadSavedSettings();
    
    // Listen for config changes from other components
    const handleConfigChange = (event: CustomEvent<LocalAIConfig>) => {
      setConfig(event.detail);
      loadSavedSettings();
    };
    
    window.addEventListener('localAIConfigChanged', handleConfigChange as EventListener);
    return () => {
      window.removeEventListener('localAIConfigChanged', handleConfigChange as EventListener);
    };
  }, []);

  // Auto-save config and sync service whenever it changes
  useEffect(() => {
    saveLocalConfig(config);
    syncLocalAIService();
  }, [config]);
  
  // Handle model selection change
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    const model = savedModels.find(m => m.id === modelId);
    if (model) {
      setActiveModel(model.id); // This will trigger the sync
      setActiveModelState(model);
      
      // Make sure the config is updated
      const currentConfig = getLocalConfig();
      saveLocalConfig({
        ...currentConfig,
        provider: model.provider,
        endpoint: model.endpoint,
        model: model.id,
        activeModel: model.id,
        isActive: true
      });
      
      // Sync the service
      syncLocalAIService();
    }
  };

  // Reset all settings
  const resetAllSettings = () => {
    if (window.confirm('Are you sure you want to reset all AI settings? This cannot be undone.')) {
      setConfig({
        provider: '',
        endpoint: '',
        model: '',
        activeModel: '',
        isActive: false,
        connectionType: 'scan'
      });
      setSavedModels([]);
      setActiveModelState(null);
      setSelectedModelId('');
      localStorage.removeItem('savedModels');
      localStorage.removeItem('localAIConfig');
      setStatusMessage('All AI settings have been reset');
      setTestStatus({
        success: true,
        message: 'Settings reset successfully'
      });
    }
  };

  // Delete offline models
  const deleteOfflineModels = async () => {
    const results = await checkAllConnections();
    const offlineModels = results.filter(r => !r.status).map(r => r.model.id);
    
    if (offlineModels.length === 0) {
      setStatusMessage('No offline models found');
        return;
      }

    if (window.confirm(`Delete ${offlineModels.length} offline models?`)) {
      const updatedModels = savedModels.filter(m => !offlineModels.includes(m.id));
      setSavedModels(updatedModels);
      
      if (activeModel && offlineModels.includes(activeModel.id)) {
        setActiveModelState(null);
        setSelectedModelId('');
      }
      
      setStatusMessage(`Deleted ${offlineModels.length} offline models`);
      setTestStatus({
        success: true,
        message: `Deleted ${offlineModels.length} offline models`
      });
    }
  };

  // Backup settings
  const backupSettings = () => {
    try {
      const backup = {
        config,
        models: savedModels
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai-settings-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatusMessage('Settings backed up successfully');
          setTestStatus({
            success: true,
        message: 'Backup created successfully'
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Error creating backup: ${errorMsg}`);
      setTestStatus({
        success: false,
        message: `Error: ${errorMsg}`
      });
    }
  };

  // Import settings
  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        setConfig(backup.config);
        setSavedModels(backup.models);
        
        const active = backup.models.find((m: AIModel) => m.id === backup.config.activeModel);
        if (active) {
          setActiveModelState(active);
          setSelectedModelId(active.id);
        }
        
        setStatusMessage('Settings imported successfully');
          setTestStatus({
            success: true,
          message: 'Import successful'
        });
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        setStatusMessage(`Error importing settings: ${errorMsg}`);
        setTestStatus({
          success: false,
          message: `Error: ${errorMsg}`
        });
      }
    };
    reader.readAsText(file);
  };

  // Test specific model
  const testModelConnection = async (model: AIModel) => {
    setIsTesting(true);
    setStatusMessage(`Testing connection to ${model.name}...`);
    
    try {
      const url = new URL(model.endpoint);
      const config: CustomPortConfig = {
        ip: url.hostname,
        port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
        name: model.name,
        type: model.provider,
        endpoint: url.pathname
      };
      
      const result = await testCustomAIConnection(config);
      
      setStatusMessage(result.success ? 
        `Successfully connected to ${model.name}` : 
        `Failed to connect to ${model.name}`);
        setTestStatus({ 
        success: result.success,
        message: result.success ? 
          `Connection to ${model.name} successful` : 
          result.error || 'Connection failed'
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Error testing connection: ${errorMsg}`);
      setTestStatus({ 
        success: false, 
        message: `Error: ${errorMsg}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="text-white/90">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-4">AI Config</h3>
        
        {/* Main Window */}
        <div className="p-4 bg-white/5 rounded border border-white/20 mb-4">
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Active AI Model</h4>
              <div className="p-3 bg-white/5 rounded border border-white/20">
                {activeModel ? (
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-sm font-medium text-white/90">{activeModel.name}</h5>
                        <p className="text-xs text-white/60">
                          {activeModel.provider.charAt(0).toUpperCase() + activeModel.provider.slice(1)} Provider
                        </p>
                      </div>
                      <button
                        onClick={() => testModelConnection(activeModel)}
                        disabled={isTesting}
                        className="px-3 py-1 text-xs bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
                      >
                        {isTesting ? 'Testing...' : 'Test Connection'}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-medium text-white/80">Endpoint:</span>
                        <span className="text-xs text-white/60 font-mono">{activeModel.endpoint}</span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-medium text-white/80">Type:</span>
                        <span className="text-xs text-white/60">
                          {activeModel.provider === 'lmstudio' ? 'LM Studio Server' :
                           activeModel.provider === 'ollama' ? 'Ollama Local AI' :
                           activeModel.provider === 'api' ? 'External API' : 'Custom Server'}
                        </span>
                      </div>
                      {activeModel.isMultimodal && (
                        <span className="inline-block px-2 py-0.5 text-xs bg-green-900/50 text-green-400 rounded">
                          Supports Multimodal
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-white/60">No active model selected</p>
                )}
              </div>
            </div>

    <div>
              <label className="block text-sm font-medium mb-2" htmlFor="modelSelect">
                Select AI Model
              </label>
              <div className="relative">
                <select
                  id="modelSelect"
                  value={selectedModelId}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full p-2 pr-8 border border-white/20 bg-black/50 rounded text-white/90 appearance-none"
                >
                  <option value="">Choose a model...</option>
                  {savedModels.map(model => (
                    <option key={model.id} value={model.id}>
                      {model.provider === 'lmstudio' ? '🖥️ ' :
                       model.provider === 'ollama' ? '🤖 ' :
                       model.provider === 'api' ? '🌐 ' : '⚡ '}
                      {model.name} {model.isMultimodal ? '(Multimodal)' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {savedModels.length === 0 && (
                <p className="mt-2 text-xs text-white/60">
                  No models available. Use the Scan tab to detect AI servers or add one manually.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={resetAllSettings}
                className="px-3 py-1 text-xs bg-red-900/50 text-red-400 rounded hover:bg-red-900/70 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Reset All
              </button>
              <button
                onClick={deleteOfflineModels}
                className="px-3 py-1 text-xs bg-orange-900/50 text-orange-400 rounded hover:bg-orange-900/70 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Delete Offline
              </button>
              <button
                onClick={backupSettings}
                className="px-3 py-1 text-xs bg-green-900/50 text-green-400 rounded hover:bg-green-900/70 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Backup Settings
              </button>
              <label className="px-3 py-1 text-xs bg-blue-900/50 text-blue-400 rounded hover:bg-blue-900/70 cursor-pointer flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Settings
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-white/20 mb-4">
        <button 
          className={`py-2 px-4 ${activeTab === 'scan' ? 'bg-white/10 border-t border-r border-l border-white/20 rounded-t' : 'text-white/70'}`}
          onClick={() => setActiveTab('scan')}
        >
          Scan
        </button>
          <button
          className={`py-2 px-4 ${activeTab === 'custom' ? 'bg-white/10 border-t border-r border-l border-white/20 rounded-t' : 'text-white/70'}`}
          onClick={() => setActiveTab('custom')}
          >
          Custom
          </button>
          <button
          className={`py-2 px-4 ${activeTab === 'api' ? 'bg-white/10 border-t border-r border-l border-white/20 rounded-t' : 'text-white/70'}`}
          onClick={() => setActiveTab('api')}
          >
          API
          </button>
          <button
          className={`py-2 px-4 ${activeTab === 'models' ? 'bg-white/10 border-t border-r border-l border-white/20 rounded-t' : 'text-white/70'}`}
          onClick={() => setActiveTab('models')}
          >
          Models
          </button>
        </div>
        
      {/* Tab Content */}
      <div className="mb-4">
        {/* Scan Tab */}
        {activeTab === 'scan' && (
          <div>
            <p className="text-sm text-white/80 mb-3">
              Scan for AI servers on your device and network.
            </p>
            
            <div className="space-y-3">
              <div>
                <button
                  onClick={async () => {
                    setIsScanning(true);
                    setStatusMessage('Scanning local device for AI servers...');
                    try {
                      const result = await detectLocalDeviceServers(true);
                      if (result.success && result.servers.length > 0) {
                        const bestConfig = getBestConfig(result);
                        if (bestConfig) {
                          // Create new models from detected servers
                          const newModels: AIModel[] = result.servers.map(server => {
                            const modelId = `${server.type}-${Date.now()}`;
                            return {
                              id: modelId,
                              name: `${server.type.charAt(0).toUpperCase() + server.type.slice(1)} (${server.baseUrl})`,
                              provider: server.type,
                              endpoint: server.baseUrl + (server.type === 'custom' ? '' : DEFAULT_CHAT_ENDPOINTS[server.type]),
                              isMultimodal: server.multimodalModels?.length > 0 || false,
                              isActive: false
                            };
                          });

                          // Add each new model and set the first one as active if no active model exists
                          let isFirstModel = !activeModel;
                          newModels.forEach((model, index) => {
                            addNewModel(model, isFirstModel && index === 0);
                          });

                          // Update the component state
                          const updatedModels = getSavedModels();
                          setSavedModels(updatedModels);
                          
                          // Update active model state if needed
                          const newActiveModel = getActiveModel();
                          if (newActiveModel) {
                            setActiveModelState(newActiveModel);
                            setSelectedModelId(newActiveModel.id);
                          }

                          setStatusMessage(`Found ${result.servers.length} AI servers - Added to Models tab`);
                          setTestStatus({
                            success: true,
                            message: `Successfully added ${result.servers.length} AI servers`
                          });
                        }
                      } else {
                        setStatusMessage('No AI servers found on local device');
                      }
                    } catch (error) {
                      setStatusMessage(`Error: ${error}`);
                    } finally {
                      setIsScanning(false);
                    }
                  }}
                  disabled={isScanning}
                  className="w-full px-4 py-2 bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
                >
                  {isScanning ? 'Scanning Local Device...' : 'Scan Local Device'}
                </button>
                <p className="text-xs text-white/60 mt-1">
                  Checks for LM Studio ({COMMON_AI_PORTS.lmstudio.join(', ')}), 
                  Ollama ({COMMON_AI_PORTS.ollama.join(', ')})
                </p>
              </div>
              
              <div>
                <button
                  onClick={async () => {
                    setIsScanning(true);
                    setStatusMessage('Starting smart network scan...');
                    try {
                      const result = await smartNetworkScan(true);
                      if (result.success && result.servers.length > 0) {
                        const bestConfig = getBestConfig(result);
                        if (bestConfig) {
                          // Create new models from detected servers
                          const newModels: AIModel[] = result.servers.map(server => {
                            const modelId = `${server.type}-network-${Date.now()}`;
                            return {
                              id: modelId,
                              name: `${server.type.charAt(0).toUpperCase() + server.type.slice(1)} (${server.baseUrl})`,
                              provider: server.type,
                              endpoint: server.baseUrl + (server.type === 'custom' ? '' : DEFAULT_CHAT_ENDPOINTS[server.type]),
                              isMultimodal: server.multimodalModels?.length > 0 || false,
                              isActive: false
                            };
                          });

                          // Add each new model and set the first one as active if no active model exists
                          let isFirstModel = !activeModel;
                          newModels.forEach((model, index) => {
                            addNewModel(model, isFirstModel && index === 0);
                          });

                          // Update the component state
                          const updatedModels = getSavedModels();
                          setSavedModels(updatedModels);
                          
                          // Update active model state if needed
                          const newActiveModel = getActiveModel();
                          if (newActiveModel) {
                            setActiveModelState(newActiveModel);
                            setSelectedModelId(newActiveModel.id);
                          }

                          setStatusMessage(`Found ${result.servers.length} AI servers on network - Added to Models tab`);
                          setTestStatus({
                            success: true,
                            message: `Successfully added ${result.servers.length} AI servers from network`
                          });
                        }
                      } else {
                        setStatusMessage('No AI servers found on network');
                      }
                    } catch (error) {
                      setStatusMessage(`Error: ${error}`);
                    } finally {
                      setIsScanning(false);
                    }
                  }}
                  disabled={isScanning}
                  className="w-full px-4 py-2 bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
                >
                  {isScanning ? 'Scanning Network...' : 'Smart Network Scan'}
                </button>
                <p className="text-xs text-white/60 mt-1">
                  Intelligently scans your network for AI servers
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div>
            <p className="text-sm text-white/80 mb-3">
              Add a custom AI server by specifying its details.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Name (Optional)</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  placeholder="My Custom AI"
                />
            </div>
            
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm mb-1">Server Type</label>
                  <select 
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value as any)}
                    className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  >
                    <option value="lmstudio">LM Studio</option>
                    <option value="ollama">Ollama</option>
                    <option value="custom">Other</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">IP Address</label>
                  <input
                    type="text"
                    value={customIP}
                    onChange={(e) => setCustomIP(e.target.value)}
                    className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                    placeholder="localhost"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1">Port</label>
                  <input
                    type="text"
                    value={customPort}
                    onChange={(e) => setCustomPort(e.target.value)}
                    className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                    placeholder={customType === 'lmstudio' ? '1234' : customType === 'ollama' ? '11434' : '8080'}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Model Name (Optional)</label>
                <input 
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  placeholder="Custom model name"
                />
              </div>
              
        <button
                onClick={async () => {
                  setIsTesting(true);
                  try {
                    const customConfig: CustomPortConfig = {
                      ip: customIP,
                      port: parseInt(customPort),
                      name: customName || `Custom ${customType.charAt(0).toUpperCase() + customType.slice(1)}`,
                      type: customType,
                      endpoint: customType === 'custom' ? undefined : DEFAULT_ENDPOINTS[customType]
                    };
                    
                    const success = await addAIModel(
                      customConfig,
                      customModelName || 'custom-model',
                      true
                    );
                    
                    if (success) {
                      const models = getSavedModels();
                      setSavedModels(models);
                      setStatusMessage('Custom AI server added successfully');
                      
                      // Clear form
                      setCustomName('');
                      setCustomPort('');
                      setCustomModelName('');
                    }
                  } catch (error) {
                    setStatusMessage(`Error: ${error}`);
                  } finally {
                    setIsTesting(false);
                  }
                }}
                disabled={!customPort || isScanning || isTesting}
                className="w-full px-4 py-2 bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
              >
                {isTesting ? 'Testing Connection...' : 'Add Custom AI Server'}
        </button>
            </div>
          </div>
        )}
        
        {/* API Tab */}
        {activeTab === 'api' && (
          <div>
            <p className="text-sm text-white/80 mb-3">
              Connect to an external AI API.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">API Name (Optional)</label>
                <input 
                  type="text"
                  value={apiModelName}
                  onChange={(e) => setApiModelName(e.target.value)}
                  className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  placeholder="My API Integration"
                />
      </div>
      
              <div>
                <label className="block text-sm mb-1">API Endpoint</label>
                <input 
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
          className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  placeholder="https://api.example.com/v1/chat/completions"
                />
      </div>
      
              <div>
                <label className="block text-sm mb-1">API Key</label>
          <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full p-2 border border-white/20 bg-black/50 rounded text-white/90"
                  placeholder="sk-..."
                />
              </div>
              
          <button
                onClick={async () => {
                  setIsTesting(true);
                  try {
                    const testResult = await testCustomAIConnection({
                      ip: new URL(apiEndpoint).hostname,
                      port: parseInt(new URL(apiEndpoint).port) || 443,
                      name: apiModelName || 'API Integration',
                      type: 'api',
                      endpoint: new URL(apiEndpoint).pathname
                    });
                    
                    if (testResult.success) {
                      const modelId = `api-${Date.now()}`;
                      const newModel: AIModel = {
                        id: modelId,
                        name: apiModelName || 'API Integration',
                        provider: 'api',
                        endpoint: apiEndpoint,
                        isMultimodal: false,
                        isActive: true
                      };
                      
                      const updatedModels = savedModels.map(m => ({...m, isActive: false}));
                      updatedModels.push(newModel);
                      
                      // Save the updated models to localStorage
                      saveAIModels(updatedModels);
                      setSavedModels(updatedModels);
                      setActiveModelState(newModel);
                      setSelectedModelId(modelId);
                      
                      // Update and save the config
                      const updatedConfig = {
                        ...config,
                        provider: 'api',
                        endpoint: apiEndpoint,
                        model: modelId,
                        apiKey: apiKey,
                        connectionType: 'api',
                        isActive: true,
                        activeModel: modelId
                      };
                      setConfig(updatedConfig);
                      saveLocalConfig(updatedConfig);
                      
                      // Sync the service
                      syncLocalAIService();
                      
                      setStatusMessage('API integration added successfully');
                      
                      // Clear form
                      setApiEndpoint('');
                      setApiKey('');
                      setApiModelName('');
                    } else {
                      setStatusMessage(`Connection test failed: ${testResult.message || 'Unknown error'}`);
                    }
                  } catch (error) {
                    console.error('Error adding API integration:', error);
                    setStatusMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  } finally {
                    setIsTesting(false);
                  }
                }}
                disabled={!apiEndpoint || isScanning || isTesting}
                className="w-full px-4 py-2 bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
              >
                {isTesting ? 'Testing Connection...' : 'Add API Integration'}
          </button>
        </div>
          </div>
        )}
        
        {/* Models Tab */}
        {activeTab === 'models' && (
          <div>
            <p className="text-sm text-white/80 mb-3">
              Manage your saved AI models.
            </p>
            
            <div className="space-y-4">
              {savedModels.map((model) => (
                <div 
                  key={model.id}
                  className="p-3 bg-white/5 rounded border border-white/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-sm font-medium">{model.name}</h4>
                      <p className="text-xs text-white/60">{model.endpoint}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => testModelConnection(model)}
                        disabled={isTesting}
                        className="px-2 py-1 text-xs bg-white/10 text-white/90 rounded hover:bg-white/20 disabled:opacity-50"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${model.name}?`)) {
                            const updatedModels = savedModels.filter(m => m.id !== model.id);
                            setSavedModels(updatedModels);
                            
                            if (activeModel?.id === model.id) {
                              setActiveModelState(null);
                              setSelectedModelId('');
                            }
                            
                            setStatusMessage(`Deleted ${model.name}`);
                          }
                        }}
                        className="px-2 py-1 text-xs bg-red-900/50 text-red-400 rounded hover:bg-red-900/70"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/60">
                    <p>Provider: {model.provider}</p>
                    {model.isMultimodal && (
                      <p className="text-green-400">Supports multimodal</p>
                    )}
                  </div>
                </div>
              ))}
              
              {savedModels.length === 0 && (
                <p className="text-sm text-white/60 text-center py-4">
                  No saved models. Add one using the Scan, Custom, or API tabs.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Status Message */}
      {statusMessage && (
        <div className="mb-4 text-sm text-white/80">
          {statusMessage}
      </div>
      )}
      
      {/* Test Status */}
      {testStatus && (
        <div className={`p-3 mb-4 rounded ${testStatus.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {testStatus.message}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-white/10 text-white/90 rounded hover:bg-white/20"
          >
          Close
          </button>
      </div>
    </div>
  );
};

export default LocalAISettings; 