export interface ElectronAPI {
  updateContentDimensions: (dimensions: {
    width: number
    height: number
  }) => Promise<void>
  clearStore: () => Promise<{ success: boolean; error?: string }>
  getScreenshots: () => Promise<{
    success: boolean
    previews?: Array<{ path: string; preview: string }> | null
    error?: string
  }>
  deleteScreenshot: (
    path: string
  ) => Promise<{ success: boolean; error?: string }>
  onScreenshotTaken: (
    callback: (data: { path: string; preview: string }) => void
  ) => () => void
  onResetView: (callback: () => void) => () => void
  onSolutionStart: (callback: () => void) => () => void
  onDebugStart: (callback: () => void) => () => void
  onDebugSuccess: (callback: (data: any) => void) => () => void
  onSolutionError: (callback: (error: string) => void) => () => void
  onProcessingNoScreenshots: (callback: () => void) => () => void
  onProblemExtracted: (callback: (data: any) => void) => () => void
  onSolutionSuccess: (callback: (data: any) => void) => () => void
  onDebugError: (callback: (error: string) => void) => () => void
  openExternal: (url: string) => void
  toggleMainWindow: () => Promise<{ success: boolean; error?: string }>
  triggerScreenshot: () => Promise<{ success: boolean; error?: string }>
  triggerProcessScreenshots: () => Promise<{ success: boolean; error?: string }>
  triggerReset: () => Promise<{ success: boolean; error?: string }>
  triggerMoveLeft: () => Promise<{ success: boolean; error?: string }>
  triggerMoveRight: () => Promise<{ success: boolean; error?: string }>
  triggerMoveUp: () => Promise<{ success: boolean; error?: string }>
  triggerMoveDown: () => Promise<{ success: boolean; error?: string }>
  startUpdate: () => Promise<{ success: boolean; error?: string }>
  installUpdate: () => void
  onUpdateAvailable: (callback: (info: any) => void) => () => void
  onUpdateDownloaded: (callback: (info: any) => void) => () => void
  getPlatform: () => string
  testLocalAI: (config: any) => Promise<{ success: boolean; message?: string; error?: string }>
  testLocalAIConnection: (config: any) => Promise<{ 
    success: boolean; 
    message?: string; 
    error?: string;
    models?: any;
    response?: any;
  }>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
    electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void
        removeListener: (
          channel: string,
          func: (...args: any[]) => void
        ) => void
      }
    }
    __LANGUAGE__: string
    __IS_INITIALIZED__: boolean
    localAIService: {
      queryLocalAI: (prompt: string, systemPrompt?: string) => Promise<any>;
    };
  }
}
