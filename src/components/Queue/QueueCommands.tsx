import React, { useState, useEffect, useRef } from "react"
import { LanguageSelector } from "../shared/LanguageSelector"
import { COMMAND_KEY } from "../../utils/platform"
import LocalAISettings from "../LocalAISettings"

interface QueueCommandsProps {
  onTooltipVisibilityChange: (visible: boolean, height: number) => void
  screenshotCount?: number
  language: string
  setShowSettings: (show: boolean) => void
}

const QueueCommands: React.FC<QueueCommandsProps> = ({
  onTooltipVisibilityChange,
  screenshotCount = 0,
  language,
  setShowSettings
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const [showAISettings, setShowAISettings] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let tooltipHeight = 0
    if (tooltipRef.current && isTooltipVisible) {
      tooltipHeight = tooltipRef.current.offsetHeight + 10
    }
    onTooltipVisibilityChange(isTooltipVisible, tooltipHeight)
  }, [isTooltipVisible, onTooltipVisibilityChange, showAISettings])

  const handleMouseEnter = () => {
    setIsTooltipVisible(true)
  }

  const handleMouseLeave = () => {
    if (!showAISettings) {
      setIsTooltipVisible(false)
    }
  }

  const showToast = (message: string) => {
    // Simple toast implementation
    console.log(message)
  }

  return (
    <div>
      <div className="pt-2 w-fit">
        <div className="text-xs text-white/90 backdrop-blur-md bg-black/60 rounded-lg py-2 px-4 flex items-center justify-center gap-4">
          {/* Screenshot */}
          <div
            className="flex items-center gap-2 cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
            onClick={async () => {
              try {
                const result = await window.electronAPI.triggerScreenshot()
                if (!result.success) {
                  console.error("Failed to take screenshot:", result.error)
                  showToast("Failed to take screenshot")
                }
              } catch (error) {
                console.error("Error taking screenshot:", error)
                showToast("Failed to take screenshot")
              }
            }}
          >
            <span className="text-[11px] leading-none truncate">
              {screenshotCount === 0
                ? "Take first screenshot"
                : screenshotCount === 1
                ? "Take second screenshot"
                : "Reset first screenshot"}
            </span>
            <div className="flex gap-1">
              <button className="bg-white/10 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                {COMMAND_KEY}
              </button>
              <button className="bg-white/10 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                H
              </button>
            </div>
          </div>

          {/* Solve Command */}
          {screenshotCount > 0 && (
            <div
              className="flex flex-col cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
              onClick={async () => {
                try {
                  const result =
                    await window.electronAPI.triggerProcessScreenshots()
                  if (!result.success) {
                    console.error(
                      "Failed to process screenshots:",
                      result.error
                    )
                    showToast("Failed to process screenshots")
                  }
                } catch (error) {
                  console.error("Error processing screenshots:", error)
                  showToast("Failed to process screenshots")
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] leading-none">Solve </span>
                <div className="flex gap-1 ml-2">
                  <button className="bg-white/10 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                    {COMMAND_KEY}
                  </button>
                  <button className="bg-white/10 rounded-md px-1.5 py-1 text-[11px] leading-none text-white/70">
                    ↵
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Separator */}
          <div className="mx-2 h-4 w-px bg-white/20" />

          {/* Settings with Tooltip */}
          <div
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Gear icon */}
            <div 
              className="w-4 h-4 flex items-center justify-center cursor-pointer text-white/70 hover:text-white/90 transition-colors"
              onClick={() => {
                setIsTooltipVisible(true)
                setShowAISettings(false)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>

            {/* Tooltip Content */}
            {isTooltipVisible && (
              <div
                ref={tooltipRef}
                className="absolute top-full left-0 mt-2 transform -translate-x-[calc(50%-12px)]"
                style={{ zIndex: 100, width: showAISettings ? "400px" : "320px" }}
              >
                {/* Add transparent bridge */}
                <div className="absolute -top-2 right-0 w-full h-2" />
                <div className="p-3 text-xs bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white/90 shadow-lg">
                  {!showAISettings ? (
                    <div className="space-y-4">
                      <h3 className="font-medium truncate">Keyboard Shortcuts</h3>
                      <div className="space-y-3">
                        {/* Toggle Command */}
                        <div
                          className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
                          onClick={async () => {
                            try {
                              const result =
                                await window.electronAPI.toggleMainWindow()
                              if (!result.success) {
                                console.error(
                                  "Failed to toggle window:",
                                  result.error
                                )
                                showToast("Failed to toggle window")
                              }
                            } catch (error) {
                              console.error("Error toggling window:", error)
                              showToast("Failed to toggle window")
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">Toggle Window</span>
                            <div className="flex gap-1 flex-shrink-0">
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                {COMMAND_KEY}
                              </span>
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                B
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Show or hide this window.
                          </p>
                        </div>

                        {/* Screenshot Command */}
                        <div
                          className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
                          onClick={async () => {
                            try {
                              const result =
                                await window.electronAPI.triggerScreenshot()
                              if (!result.success) {
                                console.error(
                                  "Failed to take screenshot:",
                                  result.error
                                )
                                showToast("Failed to take screenshot")
                              }
                            } catch (error) {
                              console.error("Error taking screenshot:", error)
                              showToast("Failed to take screenshot")
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">Take Screenshot</span>
                            <div className="flex gap-1 flex-shrink-0">
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                {COMMAND_KEY}
                              </span>
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                H
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Capture a screenshot of the problem.
                          </p>
                        </div>

                        {/* Process Command */}
                        <div
                          className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
                          onClick={async () => {
                            try {
                              const result =
                                await window.electronAPI.triggerProcessScreenshots()
                              if (!result.success) {
                                console.error(
                                  "Failed to process screenshots:",
                                  result.error
                                )
                                showToast("Failed to process screenshots")
                              }
                            } catch (error) {
                              console.error("Error processing screenshots:", error)
                              showToast("Failed to process screenshots")
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">Process Screenshots</span>
                            <div className="flex gap-1 flex-shrink-0">
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                {COMMAND_KEY}
                              </span>
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                ↵
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Generate solutions from screenshots.
                          </p>
                        </div>

                        {/* Reset Command */}
                        <div
                          className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
                          onClick={async () => {
                            try {
                              const result = await window.electronAPI.triggerReset()
                              if (!result.success) {
                                console.error("Failed to reset:", result.error)
                                showToast("Failed to reset")
                              }
                            } catch (error) {
                              console.error("Error resetting:", error)
                              showToast("Failed to reset")
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">Reset</span>
                            <div className="flex gap-1 flex-shrink-0">
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                {COMMAND_KEY}
                              </span>
                              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] leading-none">
                                R
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Reset the application state.
                          </p>
                        </div>

                        {/* Language Selector */}
                        <div className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="truncate">Language</span>
                            <LanguageSelector 
                              currentLanguage={language} 
                              onChange={(lang) => {
                                window.__LANGUAGE__ = lang;
                              }} 
                            />
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Select the programming language.
                          </p>
                        </div>

                        {/* AI Settings */}
                        <div
                          className="cursor-pointer rounded px-2 py-1.5 hover:bg-white/10 transition-colors"
                          onClick={() => setShowAISettings(true)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">AI Settings</span>
                            <div className="flex gap-1 flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-3.5 h-3.5"
                              >
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </div>
                          </div>
                          <p className="text-[10px] leading-relaxed text-white/70 truncate mt-1">
                            Configure local AI settings.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4">
                        <button
                          onClick={() => setShowAISettings(false)}
                          className="mr-2 p-1 rounded hover:bg-white/10"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="font-medium">AI Settings</h3>
                      </div>
                      <div className="max-h-[70vh] overflow-y-auto pr-1">
                        <LocalAISettings onClose={() => setShowAISettings(false)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QueueCommands
