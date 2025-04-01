/// <reference types="vite/client" />

import { ToastMessage } from "./components/ui/toast"

interface ImportMetaEnv {
  readonly NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  electronAPI: {
    // Screenshot management
    takeScreenshot: () => Promise<string>;
    getImagePreview: (filepath: string) => Promise<string>;
    deleteScreenshot: (path: string) => Promise<{ success: boolean; error?: string }>;
    
    // Window management
    setWindowDimensions: (width: number, height: number) => void;
    toggleMainWindow: () => void;
    moveWindowLeft: () => void;
    moveWindowRight: () => void;
    moveWindowUp: () => void;
    moveWindowDown: () => void;
    
    // Event handlers
    onSolutionSuccess: (callback: (solution: any) => void) => () => void;
    onSolutionError: (callback: (error: string) => void) => () => void;
    onProblemExtracted: (callback: (problem: any) => void) => () => void;
    onDebugSuccess: (callback: (debug: any) => void) => () => void;
    onDebugError: (callback: (error: string) => void) => () => void;
    onInitialStart: (callback: () => void) => () => void;
    onNoScreenshots: (callback: () => void) => () => void;
    
    // Local AI testing
    testLocalAIConnection: (config: any) => Promise<any>;
  };
  
  // App state
  __IS_INITIALIZED__: boolean;
  __LANGUAGE__: string;
  localAIService: {
    queryLocalAI: (prompt: string, systemPrompt?: string) => Promise<any>;
  };
}

declare module '*.svg' {
  const content: any;
  export default content;
}
