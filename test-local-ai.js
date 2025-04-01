// Simple test script to verify local AI connection
const axios = require('axios');

async function testLMStudio() {
  console.log("Testing LM Studio connection...");
  
  const baseUrl = 'http://127.0.0.1:1234';
  
  // Test models endpoint
  try {
    console.log("Testing models endpoint...");
    const modelsResponse = await axios.get(`${baseUrl}/v1/models`, {
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log("Models response:", modelsResponse.data);
    
    // Test completions endpoint
    console.log("\nTesting completions endpoint...");
    const completionsResponse = await axios.post(
      `${baseUrl}/v1/completions`,
      {
        model: "llama-3.2-3b-instruct",
        prompt: "You are a helpful assistant.\n\nUser: Say hello\n\nAssistant:",
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      },
      {
        timeout: 120000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log("Completions response:", completionsResponse.data);
    
    // Test chat endpoint as fallback
    console.log("\nTesting chat endpoint...");
    const chatResponse = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      {
        model: "llama-3.2-3b-instruct",
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello' }
        ],
        temperature: 0.7,
        max_tokens: 100,
        stream: false
      },
      {
        timeout: 120000,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    console.log("Chat response:", chatResponse.data);
    console.log("\nAll tests successful!");
    
  } catch (error) {
    console.error("\nError testing LM Studio:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
    if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused. Is LM Studio running?");
    } else if (error.code === 'ETIMEDOUT') {
      console.error("Request timed out. The model may be too slow or the request too large.");
    }
  }
}

// Run the test
testLMStudio(); 