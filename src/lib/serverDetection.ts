import axios from 'axios';
import { LocalAIConfig, AIModel, getSavedModels, saveAIModels, setActiveModel } from './localConfig';

export interface DetectedServer {
  type: 'lmstudio' | 'ollama' | 'custom' | 'api';
  baseUrl: string;
  endpoint?: string;
  models: any;
  hasMultimodal: boolean;
  multimodalModels?: string[];
  allModels?: string[];
  selectedModel?: string;
}

export interface DetectionResult {
  servers: DetectedServer[];
  message: string;
  success: boolean;
  models?: any;
  error?: string;
}

export interface NetworkScanConfig {
  scanLocalhost: boolean;
  scanSubnet: boolean;
  scanRange: boolean;
  startIP?: number;
  endIP?: number;
  customIPs?: string[];
  timeout: number;
  maxConcurrent: number;
}

export interface CustomPortConfig {
  ip: string;
  port: number;
  name: string;
  type: 'lmstudio' | 'ollama' | 'custom' | 'api';
  endpoint?: string;
}

const DEFAULT_SCAN_CONFIG: NetworkScanConfig = {
  scanLocalhost: true,
  scanSubnet: true,
  scanRange: false,
  startIP: 1,
  endIP: 20,
  timeout: 2000,
  maxConcurrent: 5
};

// Common AI service ports
export const COMMON_AI_PORTS = {
  lmstudio: [1234, 8080, 5000],
  ollama: [11434, 8000],
  localai: [8080, 5000],
  textgen: [7860, 5000],
  koboldai: [5000, 5001],
  custom: [3000, 8000, 8080, 5000]
};

// Default endpoints for different AI types
export const DEFAULT_ENDPOINTS = {
  lmstudio: '/v1/models',
  ollama: '/api/tags',
  api: '/v1/models'
};

// Default chat endpoints for different AI types
export const DEFAULT_CHAT_ENDPOINTS = {
  'lmstudio': '/v1/chat/completions',
  'ollama': '/api/chat',
  'custom': '/v1/chat/completions',
  'api': '/v1/chat/completions'
};

/**
 * Request permission from the user to scan the network
 * @returns Promise<boolean> - True if permission granted, false otherwise
 */
export async function requestNetworkScanPermission(): Promise<boolean> {
  // In a real implementation, this would show a dialog to the user
  // For now, we'll just return true to simulate user permission
  return new Promise((resolve) => {
    // Simulate a dialog with a slight delay
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

/**
 * Get local IP addresses for scanning
 * @param config - Network scan configuration
 * @returns Promise<string[]> - Array of IP addresses to scan
 */
export async function getLocalIPs(config: NetworkScanConfig = DEFAULT_SCAN_CONFIG): Promise<string[]> {
  const ips: string[] = [];
  
  // Always include localhost if configured
  if (config.scanLocalhost) {
    ips.push('localhost');
    ips.push('127.0.0.1');
  }
  
  // Add custom IPs if provided
  if (config.customIPs && config.customIPs.length > 0) {
    ips.push(...config.customIPs);
  }
  
  // Scan subnet if configured
  if (config.scanSubnet) {
    try {
      // In a real implementation, we would detect the actual subnet
      // For now, we'll use a common home network subnet
      const subnet = '192.168.1';
      
      // If range scanning is enabled, use the specified range
      if (config.scanRange && config.startIP !== undefined && config.endIP !== undefined) {
        const start = Math.max(1, config.startIP);
        const end = Math.min(254, config.endIP);
        
        for (let i = start; i <= end; i++) {
          ips.push(`${subnet}.${i}`);
        }
      } else {
        // Otherwise, just add some common IP addresses
        for (let i = 1; i <= 5; i++) {
          ips.push(`${subnet}.${i}`);
        }
      }
    } catch (error) {
      console.error('Error detecting subnet:', error);
    }
  }
  
  return ips;
}

/**
 * Get network interfaces using WebRTC
 */
async function getNetworkInterfaces(): Promise<string[]> {
  return new Promise((resolve) => {
    const ips: string[] = [];
    
    if (typeof window === 'undefined' || !window.RTCPeerConnection) {
      resolve(ips);
      return;
    }
    
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    
    // Set a timeout to resolve even if we don't get all candidates
    const timeout = setTimeout(() => {
      pc.close();
      resolve(ips);
    }, 2000);
    
    pc.createOffer().then(pc.setLocalDescription.bind(pc));
    
    pc.onicecandidate = (ice) => {
      if (!ice || !ice.candidate || !ice.candidate.candidate) return;
      
      const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
      if (match && match[1] && !ips.includes(match[1])) {
        ips.push(match[1]);
      }
      
      // If we have at least one IP, consider resolving
      if (ips.length > 0) {
        clearTimeout(timeout);
        pc.close();
        resolve(ips);
      }
    };
  });
}

/**
 * Scan a port on a specific IP
 */
async function scanPort(ip: string, port: number, timeout: number = 2000): Promise<boolean> {
  try {
    const response = await axios.get(`http://${ip}:${port}`, {
      timeout: timeout
    });
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // If we get any response, the port is open
      return true;
    }
    return false;
  }
}

/**
 * Detect LM Studio servers
 * @param ip - IP address to scan
 * @param timeout - Timeout in milliseconds
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function detectLMStudioServers(ip: string, timeout: number = 2000): Promise<DetectionResult> {
  console.log(`Detecting LM Studio servers on ${ip}...`);
  
  // Define the ports to scan
  const ports = [1234, 8080, 8000, 3000, 5000];
  
  // Initialize the result
  const result: DetectionResult = {
    success: false,
    message: `No LM Studio servers found on ${ip}`,
    servers: []
  };
  
  // Try each port
  for (const port of ports) {
    try {
      // Construct the base URL
      const baseUrl = ip === 'localhost' || ip === '127.0.0.1'
        ? `http://${ip}:${port}`
        : `http://${ip}:${port}`;
      
      // Construct the endpoint URL
      const endpointUrl = `${baseUrl}/v1/chat/completions`;
      
      // Try to fetch the models
      const modelsUrl = `${baseUrl}/v1/models`;
      
      console.log(`Checking LM Studio server at ${modelsUrl}...`);
      
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(modelsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if the response has the expected structure
          if (data && data.data && Array.isArray(data.data)) {
            // Extract the model IDs
            const models = data.data.map((model: any) => model.id);
            
            // Check for multimodal models
            const multimodalModels = models.filter((model: string) => 
              model.toLowerCase().includes('llava') || 
              model.toLowerCase().includes('bakllava') || 
              model.toLowerCase().includes('vision') ||
              model.toLowerCase().includes('multimodal') ||
              model.toLowerCase().includes('clip')
            );
            
            // Add the server to the result
            result.servers.push({
              type: 'lmstudio',
              baseUrl,
              endpoint: endpointUrl,
              models: data,
              selectedModel: models.length > 0 ? models[0] : '',
              allModels: models,
              multimodalModels,
              hasMultimodal: multimodalModels.length > 0
            });
            
            // Update the result
            result.success = true;
            result.message = `Found LM Studio server at ${baseUrl} with ${models.length} models`;
            
            // Return early
            return result;
          }
        }
      } catch (error) {
        // Ignore fetch errors and continue to the next port
        console.log(`Error checking LM Studio server at ${modelsUrl}:`, error);
      }
    } catch (error) {
      console.error(`Error detecting LM Studio servers on ${ip}:${port}:`, error);
    }
  }
  
  return result;
}

/**
 * Detect Ollama servers
 * @param ip - IP address to scan
 * @param timeout - Timeout in milliseconds
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function detectOllamaServers(ip: string, timeout: number = 2000): Promise<DetectionResult> {
  console.log(`Detecting Ollama servers on ${ip}...`);
  
  // Define the ports to scan
  const ports = [11434, 8080, 8000, 3000, 5000];
  
  // Initialize the result
  const result: DetectionResult = {
    success: false,
    message: `No Ollama servers found on ${ip}`,
    servers: []
  };
  
  // Try each port
  for (const port of ports) {
    try {
      // Construct the base URL
      const baseUrl = ip === 'localhost' || ip === '127.0.0.1'
        ? `http://${ip}:${port}`
        : `http://${ip}:${port}`;
      
      // Construct the endpoint URL
      const endpointUrl = `${baseUrl}/api/chat`;
      
      // Try to fetch the models
      const modelsUrl = `${baseUrl}/api/tags`;
      
      console.log(`Checking Ollama server at ${modelsUrl}...`);
      
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(modelsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if the response has the expected structure
          if (data && data.models && Array.isArray(data.models)) {
            // Extract the model names
            const models = data.models.map((model: any) => model.name);
            
            // Check for multimodal models
            const multimodalModels = models.filter((model: string) => 
              model.toLowerCase().includes('llava') || 
              model.toLowerCase().includes('bakllava') || 
              model.toLowerCase().includes('vision') ||
              model.toLowerCase().includes('multimodal') ||
              model.toLowerCase().includes('clip')
            );
            
            // Add the server to the result
            result.servers.push({
              type: 'ollama',
              baseUrl,
              endpoint: endpointUrl,
              models: data,
              selectedModel: models.length > 0 ? models[0] : '',
              allModels: models,
              multimodalModels,
              hasMultimodal: multimodalModels.length > 0
            });
            
            // Update the result
            result.success = true;
            result.message = `Found Ollama server at ${baseUrl} with ${models.length} models`;
            
            // Return early
            return result;
          }
        }
      } catch (error) {
        // Ignore fetch errors and continue to the next port
        console.log(`Error checking Ollama server at ${modelsUrl}:`, error);
      }
    } catch (error) {
      console.error(`Error detecting Ollama servers on ${ip}:${port}:`, error);
    }
  }
  
  return result;
}

/**
 * Detect generic AI servers
 * @param ip - IP address to scan
 * @param timeout - Timeout in milliseconds
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function detectGenericAIServers(ip: string, timeout: number = 2000): Promise<DetectionResult> {
  console.log(`Detecting generic AI servers on ${ip}...`);
  
  // Define the ports to scan
  const ports = [8000, 8080, 3000, 5000, 4000, 7860, 9000];
  
  // Initialize the result
  const result: DetectionResult = {
    success: false,
    message: `No generic AI servers found on ${ip}`,
    servers: []
  };
  
  // Try each port
  for (const port of ports) {
    try {
      // Construct the base URL
      const baseUrl = ip === 'localhost' || ip === '127.0.0.1'
        ? `http://${ip}:${port}`
        : `http://${ip}:${port}`;
      
      // Try to fetch the root endpoint
      console.log(`Checking generic AI server at ${baseUrl}...`);
      
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Add the server to the result
          result.servers.push({
            type: 'custom',
            baseUrl,
            endpoint: `${baseUrl}/api/chat`,
            models: {},
            selectedModel: '',
            allModels: [],
            multimodalModels: [],
            hasMultimodal: false
          });
          
          // Update the result
          result.success = true;
          result.message = `Found generic AI server at ${baseUrl}`;
          
          // Return early
          return result;
        }
      } catch (error) {
        // Ignore fetch errors and continue to the next port
        console.log(`Error checking generic AI server at ${baseUrl}:`, error);
      }
    } catch (error) {
      console.error(`Error detecting generic AI servers on ${ip}:${port}:`, error);
    }
  }
  
  return result;
}

/**
 * Detect all AI servers on the network
 */
export async function detectAllServers(
  stopAfterFirst: boolean = false,
  config: NetworkScanConfig = DEFAULT_SCAN_CONFIG
): Promise<DetectionResult> {
  console.log('Detecting all servers with config:', config);
  
  try {
    // Get the IPs to scan
    const ips = await getLocalIPs(config);
    console.log(`Got ${ips.length} IPs to scan:`, ips);
    
    // Initialize the result
    const result: DetectionResult = {
      success: false,
      message: 'No AI servers found',
      servers: []
    };
    
    // Create a queue of IPs to scan
    const ipQueue = [...ips];
    let activePromises: Promise<void>[] = [];
    const maxConcurrent = config.maxConcurrent || 5;
    
    // Process the queue
    while (ipQueue.length > 0 || activePromises.length > 0) {
      // Fill the active promises array up to the maximum
      while (ipQueue.length > 0 && activePromises.length < maxConcurrent) {
        const ip = ipQueue.shift()!;
        
        // Create a promise for this IP
        const promise = (async () => {
          try {
            // Try to detect LM Studio servers
            const lmStudioResult = await detectLMStudioServers(ip, config.timeout);
            if (lmStudioResult.success) {
              result.servers.push(...lmStudioResult.servers);
              
              if (stopAfterFirst && result.servers.length > 0) {
                // Clear the queue to stop processing
                ipQueue.length = 0;
                return;
              }
            }
            
            // Try to detect Ollama servers
            const ollamaResult = await detectOllamaServers(ip, config.timeout);
            if (ollamaResult.success) {
              result.servers.push(...ollamaResult.servers);
              
              if (stopAfterFirst && result.servers.length > 0) {
                // Clear the queue to stop processing
                ipQueue.length = 0;
                return;
              }
            }
            
            // Try to detect generic AI servers
            const genericResult = await detectGenericAIServers(ip, config.timeout);
            if (genericResult.success) {
              result.servers.push(...genericResult.servers);
              
              if (stopAfterFirst && result.servers.length > 0) {
                // Clear the queue to stop processing
                ipQueue.length = 0;
                return;
              }
            }
          } catch (error) {
            console.error(`Error scanning IP ${ip}:`, error);
          }
        })();
        
        // Add the promise to the active promises array
        activePromises.push(promise);
      }
      
      // Wait for at least one promise to complete
      if (activePromises.length > 0) {
        await Promise.race(activePromises);
        
        // Filter out completed promises
        activePromises = activePromises.filter(p => p.then(() => false, () => false));
      }
      
      // If we're stopping after the first server and we found one, break out
      if (stopAfterFirst && result.servers.length > 0) {
        break;
      }
    }
    
    // Update the result
    if (result.servers.length > 0) {
      result.success = true;
      result.message = `Found ${result.servers.length} AI server(s)`;
    }
    
    return result;
  } catch (error) {
    console.error('Error detecting servers:', error);
    return {
      success: false,
      message: `Error detecting servers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      servers: []
    };
  }
}

/**
 * Get the best configuration based on detected servers
 */
export function getBestConfig(result: DetectionResult): any {
  if (!result.success || result.servers.length === 0) {
    return null;
  }
  
  // Get the first server
  const server = result.servers[0];
  
  if (server.type === 'lmstudio') {
    // For LM Studio, prefer chat completions endpoint
    const endpoint = `${server.baseUrl}/v1/chat/completions`;
    
    // Choose a model - prefer multimodal if available, otherwise any model
    let model = '';
    if (server.hasMultimodal && server.multimodalModels && server.multimodalModels.length > 0) {
      model = server.multimodalModels[0];
    } else if (server.allModels && server.allModels.length > 0) {
      model = server.allModels[0];
    }
    
    return {
      endpoint,
      model,
      provider: 'lmstudio',
      hasMultimodal: server.hasMultimodal
    };
  } 
  else if (server.type === 'ollama') {
    // For Ollama, use the API chat endpoint
    const endpoint = `${server.baseUrl}/api/chat`;
    
    // Choose a model - prefer multimodal if available, otherwise any model
    let model = '';
    if (server.hasMultimodal && server.multimodalModels && server.multimodalModels.length > 0) {
      model = server.multimodalModels[0];
    } else if (server.allModels && server.allModels.length > 0) {
      model = server.allModels[0];
    }
    
    return {
      endpoint,
      model,
      provider: 'ollama',
      hasMultimodal: server.hasMultimodal
    };
  }
  else if (server.type === 'custom') {
    // For custom servers, use the detected endpoint
    return {
      endpoint: server.endpoint || server.baseUrl,
      model: '',  // User will need to specify this
      provider: 'custom',
      hasMultimodal: false  // We can't determine this for custom servers
    };
  }
  
  return null;
}

/**
 * Test a connection to a custom AI server
 * @param config - Custom port configuration
 * @returns Promise<{ success: boolean; message?: string }> - Result of the test
 */
export async function testCustomAIConnection(config: CustomPortConfig): Promise<{ success: boolean; message?: string }> {
  try {
    // First test the models endpoint
    const baseUrl = `http://${config.ip}:${config.port}`;
    const modelsEndpoint = `${baseUrl}/v1/models`;
    console.log('Testing models endpoint:', modelsEndpoint);
    
    const modelsResponse = await fetch(modelsEndpoint);
    if (!modelsResponse.ok) {
      throw new Error(`Models endpoint returned ${modelsResponse.status}`);
    }

    // Then test the chat endpoint
    const chatEndpoint = `${baseUrl}/v1/chat/completions`;
    console.log('Testing chat endpoint:', chatEndpoint);
    
    const chatResponse = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'test',
        messages: [
          { role: 'user', content: 'test' }
        ]
      })
    });

    // 404 on chat endpoint means it's not available
    if (chatResponse.status === 404) {
      throw new Error('Chat endpoint not available');
    }

    // Any other non-200 response might be due to invalid model, which is fine
    // as long as the endpoint exists
    
    return {
      success: true,
      message: 'Connection successful'
    };
  } catch (error) {
    console.error('Error testing connection:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Add a new AI model to the saved models
 * @param config - Custom port configuration
 * @param modelName - Model name
 * @param setAsActive - Whether to set this model as active
 * @returns boolean - Success status
 */
export async function addAIModel(
  config: CustomPortConfig, 
  modelName: string, 
  setAsActive: boolean = true
): Promise<boolean> {
  try {
    // Test the connection first
    const testResult = await testCustomAIConnection(config);
    
    if (!testResult.success) {
      console.error('Failed to add AI model:', testResult.message);
      return false;
    }
    
    // Create a unique ID
    const id = `${config.type}-${config.ip}-${config.port}-${modelName}`;
    
    // Create the model entry with complete chat endpoint
    const baseUrl = `http://${config.ip}:${config.port}`;
    const endpoint = config.type === 'lmstudio' 
      ? `${baseUrl}/v1/chat/completions`
      : `${baseUrl}/api/chat`;
    
    const model: AIModel = {
      id,
      name: config.name || `${config.type} on ${config.ip}:${config.port}`,
      provider: config.type,
      endpoint,
      isMultimodal: true, // Set to true for LM Studio with llava
      isActive: setAsActive
    };
    
    // Get existing models
    const existingModels = getSavedModels();
    
    // Deactivate all other models if setting this one as active
    const updatedModels = existingModels.map(m => ({
      ...m,
      isActive: setAsActive ? false : m.isActive
    }));
    
    // Add the new model
    updatedModels.push(model);
    
    // Save the updated models
    saveAIModels(updatedModels);
    
    // If setting as active, call setActiveModel
    if (setAsActive) {
      setActiveModel(id);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding AI model:', error);
    return false;
  }
}

/**
 * Check connections for all saved AI models
 * @returns Promise<{model: AIModel, status: boolean, message: string}[]> - Results for each model
 */
export async function checkAllConnections(): Promise<{model: AIModel, status: boolean, message: string}[]> {
  const models = getSavedModels();
  const results: {model: AIModel, status: boolean, message: string}[] = [];
  
  for (const model of models) {
    try {
      // Parse the endpoint to get the IP and port
      const url = new URL(model.endpoint);
      const config: CustomPortConfig = {
        ip: url.hostname,
        port: parseInt(url.port) || (url.protocol === 'https:' ? 443 : 80),
        name: model.name,
        type: model.provider,
        endpoint: url.pathname
      };
      
      // Test the connection
      const testResult = await testCustomAIConnection(config);
      
      results.push({
        model,
        status: testResult.success,
        message: testResult.success ? 'Connected successfully' : (testResult.message || 'Connection failed')
      });
    } catch (error) {
      results.push({
        model,
        status: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
}

/**
 * Detect servers on custom port
 * @param config - Custom port configuration 
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function detectCustomServer(config: CustomPortConfig): Promise<DetectionResult> {
  const connectionTest = await testCustomAIConnection(config);
  return {
    success: connectionTest.success,
    message: connectionTest.message || '',
    servers: connectionTest.success ? [{
      type: config.type,
      baseUrl: `http://${config.ip}:${config.port}`,
      endpoint: config.endpoint,
      models: {},
      hasMultimodal: false,
      allModels: [],
      multimodalModels: []
    }] : []
  };
}

/**
 * Detect local device servers first before scanning the network
 * This is a faster approach that prioritizes finding servers on the local machine
 * @param stopAfterFirst - Whether to stop after finding the first server
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function detectLocalDeviceServers(stopAfterFirst: boolean = true): Promise<DetectionResult> {
  console.log('Detecting servers on local device...');
  
  // Initialize the result
  const result: DetectionResult = {
    success: false,
    message: 'No AI servers found on local device',
    servers: []
  };
  
  // Define the most common ports and services to check first
  const priorityServices = [
    // LM Studio - most common port
    { ip: 'localhost', port: 1234, type: 'lmstudio', endpoint: '/v1/models' },
    // Ollama - most common port
    { ip: 'localhost', port: 11434, type: 'ollama', endpoint: '/api/tags' },
    // LM Studio - alternate ports
    { ip: 'localhost', port: 8080, type: 'lmstudio', endpoint: '/v1/models' },
    { ip: 'localhost', port: 5000, type: 'lmstudio', endpoint: '/v1/models' },
    // Ollama - alternate ports
    { ip: 'localhost', port: 8000, type: 'ollama', endpoint: '/api/tags' },
    // Try 127.0.0.1 as well
    { ip: '127.0.0.1', port: 1234, type: 'lmstudio', endpoint: '/v1/models' },
    { ip: '127.0.0.1', port: 11434, type: 'ollama', endpoint: '/api/tags' }
  ];
  
  // Check each service in sequence for faster results
  for (const service of priorityServices) {
    try {
      const baseUrl = `http://${service.ip}:${service.port}`;
      const checkUrl = `${baseUrl}${service.endpoint}`;
      
      console.log(`Checking ${service.type} at ${checkUrl}...`);
      
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // Short timeout for local services
      
      try {
        const response = await fetch(checkUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });
        
        // Clear the timeout
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          
          if (service.type === 'lmstudio' && data && data.data && Array.isArray(data.data)) {
            // Extract the model IDs
            const models = data.data.map((model: any) => model.id);
            
            // Check for multimodal models
            const multimodalModels = models.filter((model: string) => 
              model.toLowerCase().includes('llava') || 
              model.toLowerCase().includes('bakllava') || 
              model.toLowerCase().includes('vision') ||
              model.toLowerCase().includes('multimodal') ||
              model.toLowerCase().includes('clip')
            );
            
            // Add the server to the result
            result.servers.push({
              type: 'lmstudio',
              baseUrl,
              endpoint: `${baseUrl}/v1/chat/completions`,
              models: data,
              allModels: models,
              multimodalModels,
              hasMultimodal: multimodalModels.length > 0
            });
            
            // Update the result
            result.success = true;
            result.message = `Found LM Studio server at ${baseUrl} with ${models.length} models`;
            
            if (stopAfterFirst) {
              return result;
            }
          } 
          else if (service.type === 'ollama' && data && data.models && Array.isArray(data.models)) {
            // Extract the model names
            const models = data.models.map((model: any) => model.name);
            
            // Check for multimodal models
            const multimodalModels = models.filter((model: string) => 
              model.toLowerCase().includes('llava') || 
              model.toLowerCase().includes('bakllava') || 
              model.toLowerCase().includes('vision') ||
              model.toLowerCase().includes('multimodal') ||
              model.toLowerCase().includes('clip')
            );
            
            // Add the server to the result
            result.servers.push({
              type: 'ollama',
              baseUrl,
              endpoint: `${baseUrl}/api/chat`,
              models: data,
              allModels: models,
              multimodalModels,
              hasMultimodal: multimodalModels.length > 0
            });
            
            // Update the result
            result.success = true;
            result.message = `Found Ollama server at ${baseUrl} with ${models.length} models`;
            
            if (stopAfterFirst) {
              return result;
            }
          }
        }
      } catch (error) {
        // Ignore fetch errors and continue to the next service
        console.log(`Error checking ${service.type} at ${checkUrl}:`, error);
      }
    } catch (error) {
      console.error(`Error detecting ${service.type} on ${service.ip}:${service.port}:`, error);
    }
  }
  
  return result;
}

/**
 * Smart network scan that tries to intelligently find AI servers
 * @param stopAfterFirst - Whether to stop after finding the first server
 * @returns Promise<DetectionResult> - Result of the detection
 */
export async function smartNetworkScan(stopAfterFirst: boolean = false): Promise<DetectionResult> {
  console.log('Starting smart network scan...');
  
  // First, try to detect servers on the local device (fastest approach)
  const localResult = await detectLocalDeviceServers(stopAfterFirst);
  
  // If we found a server on the local device, return it
  if (localResult.success && localResult.servers.length > 0) {
    console.log('Found server on local device:', localResult.servers);
    return localResult;
  }
  
  // If no server found on local device, try localhost with common ports
  console.log('No server found on local device, checking localhost with common ports...');
  const localhostConfig: NetworkScanConfig = {
    ...DEFAULT_SCAN_CONFIG,
    scanLocalhost: true,
    scanSubnet: false,
    scanRange: false,
    timeout: 1000
  };
  
  const localhostResult = await detectAllServers(stopAfterFirst, localhostConfig);
  
  // If we found a server on localhost, return it
  if (localhostResult.success && localhostResult.servers.length > 0) {
    console.log('Found server on localhost:', localhostResult.servers);
    return localhostResult;
  }
  
  // If no server found on localhost, try the subnet
  console.log('No server found on localhost, checking subnet...');
  const subnetConfig: NetworkScanConfig = {
    ...DEFAULT_SCAN_CONFIG,
    scanLocalhost: false,
    scanSubnet: true,
    scanRange: true,
    startIP: 1,
    endIP: 10, // Start with a smaller range
    timeout: 1500
  };
  
  const subnetResult = await detectAllServers(stopAfterFirst, subnetConfig);
  
  // If we found a server on the subnet, return it
  if (subnetResult.success && subnetResult.servers.length > 0) {
    console.log('Found server on subnet:', subnetResult.servers);
    return subnetResult;
  }
  
  // If still no server found, try a wider range
  console.log('No server found on initial subnet scan, trying wider range...');
  const widerRangeConfig: NetworkScanConfig = {
    ...DEFAULT_SCAN_CONFIG,
    scanLocalhost: false,
    scanSubnet: true,
    scanRange: true,
    startIP: 11,
    endIP: 30,
    timeout: 2000
  };
  
  const widerRangeResult = await detectAllServers(stopAfterFirst, widerRangeConfig);
  
  // Return whatever we found (or didn't find)
  if (widerRangeResult.success && widerRangeResult.servers.length > 0) {
    console.log('Found server in wider range:', widerRangeResult.servers);
    return widerRangeResult;
  }
  
  // If we still haven't found anything, return a failure
  return {
    success: false,
    message: 'No AI servers found on your network. Please check your server is running and try again.',
    servers: []
  };
} 