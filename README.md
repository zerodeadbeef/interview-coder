# Interview Coder - Local AI Edition

An invisible desktop application to help you pass your technical interviews, with full local AI support and optional cloud AI integration.

https://github.com/user-attachments/assets/45b48c4e-ea9c-432c-aa1a-5749614d705a

## Invisibility Compatibility

The application is invisible to:

- Zoom versions below 6.1.6 (inclusive)
- All browser-based screen recording software
- All versions of Discord
- Mac OS _screenshot_ functionality (Command + Shift + 3/4)

Note: The application is **NOT** invisible to:

- Zoom versions 6.1.6 and above
  - https://zoom.en.uptodown.com/mac/versions (link to downgrade Zoom if needed)
- Mac OS native screen _recording_ (Command + Shift + 5)

## Features

- 🎯 99% Invisibility: Undetectable window that bypasses most screen capture methods
- 📸 Smart Screenshot Capture: Capture both question text and code separately for better analysis
- 🤖 AI-Powered Analysis: Automatically extracts and analyzes coding problems
- 💡 Solution Generation: Get detailed explanations and solutions
- 🔧 Real-time Debugging: Debug your code with AI assistance
- 🎨 Window Management: Freely move and position the window anywhere on screen
- Process them using local AI models (LM 
Studio, Ollama)
- Get detailed solutions with explanations
- Debug your code with AI assistance
- All processing happens locally - your 
data never leaves your computer
- 💻 Full Offline Support: Process screenshots using local AI models (LM Studio, Ollama)
- ☁️ Optional Cloud Integration: Connect to external AI APIs when desired
- 🔒 Privacy-First: Your data never leaves your computer when using local models

## Global Commands

The application uses unidentifiable global keyboard shortcuts that won't be detected by browsers or other applications:

- Toggle Window Visibility: [Control or Cmd + b]
- Move Window: [Control or Cmd + arrows]
- Take Screenshot: [Control or Cmd + H]
- Process Screenshots: [Control or Cmd + Enter]
- Reset View: [Control or Cmd + R]
- Quit: [Control or Cmd + Q]

## Usage

1. **Initial Setup**

   - Launch the invisible window
   - Configure your local AI settings (see below)

2. **Capturing Problem**

   - Use global shortcut [Control or Cmd + H] to take screenshots
   - Screenshots are automatically added to the queue of up to 5.

3. **Processing**

   - AI analyzes the screenshots to extract:
     - Problem requirements
     - Code context
   - System generates optimal solution strategy

4. **Solution & Debugging**

   - View generated solutions
   - Use debugging feature to:
     - Test different approaches
     - Fix errors in your code
     - Get line-by-line explanations
   - Toggle between solutions and queue views

5. **Window Management**
   - Move window freely using global shortcut
   - Toggle visibility as needed
   - Window remains invisible to specified applications
   - Reset view using Command + R

## Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- Screen Recording Permission for Terminal/IDE
  - On macOS:
    1. Go to System Preferences > Security & Privacy > Privacy > Screen Recording
    2. Ensure that Interview Coder has screen recording permission enabled
    3. Restart Interview Coder after enabling permissions
  - On Windows:
    - No additional permissions needed
  - On Linux:
    - May require `xhost` access depending on your distribution

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ibttf/interview-coder-v1.git
cd interview-coder-v1
```

2. Install dependencies:

```bash
npm install
# or if using bun
bun install
```

## Running Locally

1. Start the development server:

```bash
npm run dev
```

This will:

- Start the Vite development server
- Launch the Electron application
- Enable hot-reloading for development

## Tech Stack

- Electron
- React
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- OpenAI API

## Configuration

1. On first launch, you'll need to provide 
your OpenAI API key
2. The application will store your 
settings locally using electron-store

## Building (for Roy)

after npm run build, hit:

```
node scripts/manual-notarize.js "release/
Interview-Coder-x64.dmg" && xcrun stapler 
staple "release/Interview-Coder-x64.dmg"
node scripts/manual-notarize.js "release/
Interview-Coder-arm64.dmg" && xcrun 
stapler staple "release/
Interview-Coder-arm64.dmg"
```

## Contributing

Contributions are welcome! Please feel 
free to submit a Pull Request.
- Local LLM integration (LM Studio, Ollama)
- Optional external AI API support

## Getting Started

### Prerequisites

To use Interview Coder with local AI, you need one of the following:

1. **LM Studio** - A desktop application for running LLMs locally
   - Download from [LM Studio's website](https://lmstudio.ai/)
   - Load a model of your choice
   - Start the local server (default: http://localhost:1234)

2. **Ollama** - A framework for running LLMs locally
   - Download from [Ollama's website](https://ollama.ai/)
   - Pull a model (e.g., `ollama pull llama3`)
   - Start Ollama (it runs automatically on http://localhost:11434)

### Installation

1. Download the latest release for your 
platform
2. Install and run the application
3. Configure your local AI settings (see 
below)


### Using Interview Coder with Local AI

### First-time Setup

When you first run Interview Coder, you'll need to configure your local AI settings:

1. Click the "Detect Local AI Servers" button to automatically find running LM Studio or Ollama instances
2. If your server is on a different machine in your network, enter the URL manually (e.g., http://192.168.100.182:1234/v1/chat/completions for LM Studio)
3. Select the model you want to use
4. Click "Test Connection" to verify everything is working
5. Click "Save Settings" to save your configuration

### Setting Up Multimodal Models for Screenshot Processing

For optimal screenshot processing, you should use a multimodal model that can understand both text and images:

1. In LM Studio, download one of these recommended models:
   - LLaVA (any version)
   - BakLLaVA
   - Phi-3-Vision
   - Any model with "vision" or "multimodal" in its name

2. Start the LM Studio server with your multimodal model loaded

3. In Interview Coder, go to Settings and select your multimodal model

4. Test the connection to ensure the model is working properly

5. Take a screenshot and process it - the multimodal model will be able to understand the visual content of your screenshots

> **Note**: Text-only models like Llama 3 can still be used, but they won't be able to process the visual content of screenshots effectively. They will only see the text that can be extracted from the images.

### Optional: APIs (Cloud) AI Integration

If you prefer to use external AI APIs:

1. Go to Settings
2. Toggle "Use External API"
3. Enter your API key for the selected service
4. Select the model you want to use
5. Click "Test Connection" to verify

> Note: When using external APIs, your data will be sent to the API provider.

### Taking Screenshots and Getting Solutions

1. Press `Cmd+Shift+2` (Mac) or `Ctrl+Shift+2` (Windows/Linux) to take a screenshot of a coding problem
2. The app will process the screenshot and extract the problem statement
3. It will then generate a solution using your selected AI model (local or api)
4. Review the solution, which includes:
   - Approach explanation
   - Time and space complexity analysis
   - Code implementation
   - Step-by-step walkthrough

### Debugging Your Code

1. If you encounter errors in your implementation, take a screenshot of the error
2. The app will analyze the error and provide debugging assistance
3. Follow the suggestions to fix your code

## Troubleshooting Local AI Connections

### LM Studio

- Ensure LM Studio is running and the server is started
- The default endpoint is http://localhost:1234/v1/chat/completions
- For remote connections, make sure the server is accessible on your network
- If using a custom port, update the endpoint URL accordingly
- For screenshot processing, use a multimodal model like LLaVA or BakLLaVA

### Ollama

- Ensure Ollama is running
- The default endpoint is http://localhost:11434/api/chat
- Make sure you have pulled at least one model (e.g., `ollama pull llama3`)
- For remote connections, you may need to configure Ollama to accept external connections

### General Connection Issues

- Check your firewall settings to ensure the app can access the local AI server
- If using a remote server, ensure the server is accessible from your machine
- Try restarting the local AI server
- Check the server logs for any errors

## Advanced Configuration

### Custom Endpoints

You can save custom endpoints for different AI servers:

1. Enter the endpoint URL in the settings
2. Click the "Save" button next to the URL field
3. Your custom endpoints will be available in the dropdown for future use

### System Prompts

You can customize the system prompt used for generating solutions:

1. Open the AI Settings
2. Edit the "System Prompt" field
3. Click "Save Settings"

## Known Issues

There are still some issues to be fixed in upcoming releases:
- Occasional connection interruptions with some local models
- Limited support for certain image formats in screenshots
- UI responsiveness issues with very large responses
- save AI Settings

## Privacy

Interview Coder with Local AI processes all data locally on your machine by default. When using local models, your code and problem statements never leave your computer, ensuring complete privacy.

## License

ISC License

## Support

If you encounter any issues, please open an issue on the GitHub repository.
