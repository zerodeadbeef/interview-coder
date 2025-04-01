import React, { useState, useEffect, useRef } from "react"
import ScreenshotQueue from "../components/Queue/ScreenshotQueue"
import QueueCommands from "../components/Queue/QueueCommands"
import { Screenshot } from "../types/screenshots"

async function fetchScreenshots(): Promise<Screenshot[]> {
  try {
    const existing = await window.electronAPI.getScreenshots()
    return existing
  } catch (error) {
    console.error("Error loading screenshots:", error)
    throw error
  }
}

interface QueueProps {
  setView: (view: "queue" | "solutions" | "debug") => void
  language: string
  setShowSettings: (show: boolean) => void
}

const Queue: React.FC<QueueProps> = ({
  setView,
  language,
  setShowSettings
}) => {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [tooltipHeight, setTooltipHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const loadScreenshots = async () => {
    try {
      setIsLoading(true)
      const data = await fetchScreenshots()
      setScreenshots(data)
    } catch (error) {
      console.error("Error loading screenshots:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteScreenshot = async (index: number) => {
    const screenshotToDelete = screenshots[index]

    try {
      const response = await window.electronAPI.deleteScreenshot(
        screenshotToDelete.path
      )

      if (response.success) {
        loadScreenshots() // Reload screenshots
      } else {
        console.error("Failed to delete screenshot:", response.error)
        showToast("Failed to delete the screenshot file")
      }
    } catch (error) {
      console.error("Error deleting screenshot:", error)
    }
  }

  const showToast = (message: string) => {
    // Simple toast implementation
    console.log(message)
  }

  useEffect(() => {
    // Load screenshots on mount
    loadScreenshots()
    
    // Height update logic
    const updateDimensions = () => {
      if (contentRef.current) {
        let contentHeight = contentRef.current.scrollHeight
        const contentWidth = contentRef.current.scrollWidth
        if (isTooltipVisible) {
          contentHeight += tooltipHeight
        }
        window.electronAPI.updateContentDimensions({
          width: contentWidth,
          height: contentHeight
        })
      }
    }

    // Initialize resize observer
    const resizeObserver = new ResizeObserver(updateDimensions)
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }
    updateDimensions()

    // Set up event listeners
    const cleanupFunctions = [
      window.electronAPI.onScreenshotTaken(() => loadScreenshots()),
      window.electronAPI.onResetView(() => loadScreenshots()),
      window.electronAPI.onSolutionError((error: string) => {
        showToast("There was an error processing your screenshots.")
        setView("queue") // Revert to queue if processing fails
        console.error("Processing error:", error)
      }),
      window.electronAPI.onProcessingNoScreenshots(() => {
        showToast("There are no screenshots to process.")
      })
    ]

    return () => {
      resizeObserver.disconnect()
      cleanupFunctions.forEach((cleanup) => cleanup())
    }
  }, [isTooltipVisible, tooltipHeight])

  const handleTooltipVisibilityChange = (visible: boolean, height: number) => {
    setIsTooltipVisible(visible)
    setTooltipHeight(height)
  }

  return (
    <div ref={contentRef} className={`bg-transparent w-1/2`}>
      <div className="px-4 py-3">
        <div className="space-y-3 w-fit">
          <ScreenshotQueue
            isLoading={isLoading}
            screenshots={screenshots}
            onDeleteScreenshot={handleDeleteScreenshot}
          />

          <QueueCommands
            onTooltipVisibilityChange={handleTooltipVisibilityChange}
            screenshotCount={screenshots.length}
            language={language}
            setShowSettings={setShowSettings}
          />
        </div>
      </div>
    </div>
  )
}

export default Queue
