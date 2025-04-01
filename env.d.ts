/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ElectronAPI {
  testLocalAI: (config: any) => Promise<{ success: boolean; message?: string; error?: string }>;
  testLocalAIConnection: (config: any) => Promise<{ 
    success: boolean; 
    message?: string; 
    error?: string;
    models?: any;
    response?: any;
  }>;
}

interface Window {
  electronAPI: ElectronAPI;
  __CREDITS__: number;
  __LANGUAGE__: string;
  __IS_INITIALIZED__: boolean;
  
  localAIService: {
    queryLocalAI: (prompt: string, imageData?: string) => Promise<{ content: string; error?: string }>;
  };
}
