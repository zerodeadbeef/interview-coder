import React, { useEffect, useState } from 'react';
import { getLocalConfig, getActiveModel } from '../lib/localConfig';

// ... other imports ...

const MainWindow: React.FC = () => {
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiConfigured, setIsAiConfigured] = useState(false);

  // Check AI configuration on mount and when localStorage changes
  useEffect(() => {
    const checkAiConfig = () => {
      const config = getLocalConfig();
      const activeModel = getActiveModel();
      
      setIsAiConfigured(Boolean(
        config && 
        config.isActive && 
        activeModel && 
        activeModel.isActive
      ));
    };

    // Check initial state
    checkAiConfig();

    // Listen for changes
    const handleConfigChange = () => {
      checkAiConfig();
      setAiError(null); // Clear any previous errors when config changes
    };

    window.addEventListener('localAIConfigChanged', handleConfigChange);
    window.addEventListener('storage', handleConfigChange);

    return () => {
      window.removeEventListener('localAIConfigChanged', handleConfigChange);
      window.removeEventListener('storage', handleConfigChange);
    };
  }, []);

  // Handle screenshot processing
  const handleProcessScreenshots = async () => {
    if (!isAiConfigured) {
      setAiError('Please configure and select an AI model in settings first.');
      return;
    }

    try {
      setAiError(null);
      await window.electronAPI.triggerProcessScreenshots();
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Failed to process screenshots');
    }
  };

  // ... rest of your component code ...

  return (
    <div>
      {/* ... other UI elements ... */}
      
      {aiError && (
        <div className="p-4 mb-4 bg-red-900/50 text-red-400 rounded">
          {aiError}
        </div>
      )}

      {!isAiConfigured && (
        <div className="p-4 mb-4 bg-yellow-900/50 text-yellow-400 rounded">
          Please configure and select an AI model in settings to process screenshots.
        </div>
      )}

      {/* ... rest of your UI ... */}
    </div>
  );
};

export default MainWindow; 