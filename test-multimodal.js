// Test script for AI server detection on local network
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Function to get all local IP addresses
async function getLocalIPs() {
  // Start with localhost addresses
  const localIPs = ['localhost', '127.0.0.1'];
  
  // Add all local IP addresses from network interfaces
  const networkInterfaces = os.networkInterfaces();
  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach(iface => {
      // Only include IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        localIPs.push(iface.address);
      }
    });
  });
  
  // Try to get the local network IP range - but only check a few IPs to avoid long scans
  try {
    // Try to get public IP to determine network range
    const response = await axios.get('https://api.ipify.org?format=json', { 
      timeout: 3000 
    });
    const data = response.data;
    
    if (data.ip) {
      // Extract the first three octets of the IP
      const ipParts = data.ip.split('.');
      if (ipParts.length === 4) {
        const networkPrefix = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}`;
        // Add just a few common local IPs
        for (let i = 1; i < 5; i++) {
          const ip = `${networkPrefix}.${i}`;
          if (!localIPs.includes(ip)) {
            localIPs.push(ip);
          }
        }
      }
    }
  } catch (e) {
    console.log("Could not get network IP, using default IPs only");
  }
  
  return localIPs;
}

// Function to detect LM Studio servers
async function detectLMStudioServers(localIPs) {
  const servers = [];
  const lmStudioPorts = [1234, 1235, 8000, 8080, 3000];
  const checkedIPs = new Set(); // Track which IPs we've already found servers on
  
  for (const ip of localIPs) {
    // Skip if we already found a server on this IP
    if (checkedIPs.has(ip)) continue;
    
    let foundServerOnThisIP = false;
    
    for (const port of lmStudioPorts) {
      if (foundServerOnThisIP) break; // Skip remaining ports if we found a server
      
      const baseUrl = `http://${ip}:${port}`;
      try {
        console.log(`\nTrying ${baseUrl}...`);
        const response = await axios.get(`${baseUrl}/v1/models`, {
          timeout: 2000, // Short timeout to quickly move on if not responding
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.status === 200 && response.data && response.data.data) {
          console.log(`✅ Found LM Studio server at ${baseUrl}!`);
          servers.push({
            type: 'lmstudio',
            baseUrl,
            models: response.data
          });
          
          foundServerOnThisIP = true;
          checkedIPs.add(ip); // Mark this IP as checked
          
          // Ask user if they want to continue searching
          console.log("\nFound a server! Do you want to:");
          console.log("1. Stop searching and use this server");
          console.log("2. Continue searching for more servers");
          
          // Since we can't get user input in this script directly,
          // we'll just stop after finding the first server for efficiency
          console.log("\nAutomatically stopping search after finding first server for efficiency.");
          return servers;
        }
      } catch (error) {
        // Just continue to the next endpoint
      }
    }
  }
  
  return servers;
}

// Function to detect Ollama servers
async function detectOllamaServers(localIPs) {
  const servers = [];
  const ollamaPorts = [11434];
  const checkedIPs = new Set(); // Track which IPs we've already found servers on
  
  for (const ip of localIPs) {
    // Skip if we already found a server on this IP
    if (checkedIPs.has(ip)) continue;
    
    for (const port of ollamaPorts) {
      const baseUrl = `http://${ip}:${port}`;
      try {
        console.log(`\nTrying Ollama at ${baseUrl}...`);
        const response = await axios.get(`${baseUrl}/api/tags`, {
          timeout: 2000
        });
        
        if (response.status === 200 && response.data) {
          console.log(`✅ Found Ollama server at ${baseUrl}!`);
          servers.push({
            type: 'ollama',
            baseUrl,
            models: response.data
          });
          
          checkedIPs.add(ip); // Mark this IP as checked
          
          // Ask user if they want to continue searching
          console.log("\nFound a server! Do you want to:");
          console.log("1. Stop searching and use this server");
          console.log("2. Continue searching for more servers");
          
          // Since we can't get user input in this script directly,
          // we'll just stop after finding the first server for efficiency
          console.log("\nAutomatically stopping search after finding first server for efficiency.");
          return servers;
        }
      } catch (error) {
        // Just continue to the next endpoint
      }
    }
  }
  
  return servers;
}

// Function to detect any other AI servers (generic API endpoints)
async function detectGenericAIServers(localIPs) {
  const servers = [];
  const commonPorts = [5000, 5001, 8000, 8080, 3000, 3001];
  const checkedIPs = new Set(); // Track which IPs we've already found servers on
  
  for (const ip of localIPs) {
    // Skip if we already found a server on this IP
    if (checkedIPs.has(ip)) continue;
    
    for (const port of commonPorts) {
      const baseUrl = `http://${ip}:${port}`;
      try {
        console.log(`\nTrying generic AI endpoint at ${baseUrl}...`);
        
        // Try common API endpoints
        const endpoints = [
          '/api', 
          '/v1/models', 
          '/models', 
          '/v1/completions',
          '/completions'
        ];
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(`${baseUrl}${endpoint}`, {
              timeout: 1000 // Very short timeout for generic endpoints
            });
            
            if (response.status === 200) {
              console.log(`✅ Found potential AI server at ${baseUrl}${endpoint}!`);
              servers.push({
                type: 'custom',
                baseUrl,
                endpoint: `${baseUrl}${endpoint}`,
                models: response.data
              });
              
              checkedIPs.add(ip); // Mark this IP as checked
              
              // Stop after finding the first server for efficiency
              console.log("\nAutomatically stopping search after finding first server for efficiency.");
              return servers;
            }
          } catch (error) {
            // Just continue to the next endpoint
          }
        }
      } catch (error) {
        // Just continue to the next endpoint
      }
    }
  }
  
  return servers;
}

async function testAIServers() {
  console.log("Testing AI servers on local network...");
  console.log("This test will check for any AI servers available on your network");
  console.log("It will stop searching after finding the first server for efficiency");
  
  // Get local IP addresses
  const localIPs = await getLocalIPs();
  console.log(`\nDetecting AI servers on local network...`);
  console.log(`Checking IP addresses: ${localIPs.join(', ')}`);
  
  // First try LM Studio (most common)
  let lmStudioServers = await detectLMStudioServers(localIPs);
  if (lmStudioServers.length > 0) {
    // Found LM Studio server, no need to check others
    displayResults([...lmStudioServers]);
    return;
  }
  
  // Then try Ollama
  let ollamaServers = await detectOllamaServers(localIPs);
  if (ollamaServers.length > 0) {
    // Found Ollama server, no need to check others
    displayResults([...ollamaServers]);
    return;
  }
  
  // Finally try generic AI servers
  let genericServers = await detectGenericAIServers(localIPs);
  if (genericServers.length > 0) {
    // Found generic server
    displayResults([...genericServers]);
    return;
  }
  
  // If we get here, no servers were found
  console.log("\n❌ Could not find any running AI servers.");
  console.log("Please make sure LM Studio or Ollama is running.");
  console.log("Default addresses are usually:");
  console.log("- LM Studio: http://127.0.0.1:1234");
  console.log("- Ollama: http://127.0.0.1:11434");
}

function displayResults(servers) {
  console.log(`\n✅ Found ${servers.length} AI servers on your network:`);
  
  // Display each server and its models
  for (const server of servers) {
    if (server.type === 'lmstudio') {
      console.log(`\n📡 LM Studio server at ${server.baseUrl}`);
      
      // Display all models, not just multimodal
      const models = server.models.data.map(model => model.id);
      console.log(`Available models: ${models.join(', ')}`);
      
      // Check for multimodal models
      const multimodalModels = models.filter(model => 
        model.includes('llava') || 
        model.includes('bakllava') || 
        model.includes('vision') ||
        model.includes('multimodal') ||
        model.includes('clip')
      );
      
      if (multimodalModels.length > 0) {
        console.log(`\n✅ Found ${multimodalModels.length} multimodal models: ${multimodalModels.join(', ')}`);
        console.log(`These models can process both text AND images.`);
      }
      
      console.log(`\nTo use this server in your app:`);
      console.log(`1. Set the endpoint to: ${server.baseUrl}/v1/chat/completions`);
      console.log(`2. Select any model from the list above`);
      console.log(`3. Save your settings and test the connection`);
      
    } else if (server.type === 'ollama') {
      console.log(`\n📡 Ollama server at ${server.baseUrl}`);
      
      // Display all models, not just multimodal
      const models = server.models.models?.map(model => model.name) || [];
      console.log(`Available models: ${models.join(', ')}`);
      
      // Check for multimodal models
      const multimodalModels = models.filter(model => 
        model.includes('llava') || 
        model.includes('bakllava') || 
        model.includes('vision') ||
        model.includes('multimodal') ||
        model.includes('clip')
      );
      
      if (multimodalModels.length > 0) {
        console.log(`\n✅ Found ${multimodalModels.length} multimodal models: ${multimodalModels.join(', ')}`);
        console.log(`These models can process both text AND images.`);
      }
      
      console.log(`\nTo use this server in your app:`);
      console.log(`1. Set the endpoint to: ${server.baseUrl}/api/chat`);
      console.log(`2. Select any model from the list above`);
      console.log(`3. Save your settings and test the connection`);
      
    } else if (server.type === 'custom') {
      console.log(`\n📡 Custom AI server at ${server.endpoint}`);
      console.log(`\nTo use this server in your app:`);
      console.log(`1. Set the endpoint to: ${server.endpoint}`);
      console.log(`2. Set provider to "Custom"`);
      console.log(`3. You may need to manually specify the model name`);
      console.log(`4. Save your settings and test the connection`);
    }
  }
  
  console.log("\n✨ Server detection complete!");
}

// Run the test
testAIServers(); 