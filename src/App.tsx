import { useEffect, useState, useCallback } from "react"
import Queue from "./_pages/Queue"
import Solutions from "./_pages/Solutions"
import Debug from "./_pages/Debug"

// Root component
function App() {
  const [initialized, setInitialized] = useState(false)
  const [language, setLanguage] = useState<string>("python")
  const [view, setView] = useState<"queue" | "solutions" | "debug">("queue")
  const [showSettings, setShowSettings] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastType, setToastType] = useState<"success" | "error">("success")

  // Helper function to show toast messages
  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => setToastMessage(null), 3000)
  }, [])

  // Helper function to update language
  const updateLanguage = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
    window.__LANGUAGE__ = newLanguage
  }, [])

  // Helper function to mark app as initialized
  const markInitialized = useCallback(() => {
    setInitialized(true)
    window.__IS_INITIALIZED__ = true
  }, [])

  // Initialize app state
  useEffect(() => {
    // Set initial language
    updateLanguage("python")
    
    // Mark as initialized
    markInitialized()
  }, [updateLanguage, markInitialized, showToast])

  // Render the app
  return (
    <div className="h-screen w-screen bg-transparent">
      <div className="relative h-full w-full">
        {view === "queue" && (
          <Queue
            language={language}
            setView={setView}
            setShowSettings={setShowSettings}
          />
        )}
        {view === "solutions" && (
          <Solutions
            language={language}
            setView={setView}
            setShowSettings={setShowSettings}
          />
        )}
        {view === "debug" && (
          <Debug
            language={language}
            setView={setView}
            setShowSettings={setShowSettings}
          />
        )}
        {toastMessage && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${
            toastType === "success" ? "bg-green-500" : "bg-red-500"
          }`}>
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
