import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Activity, Eye, FileText } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

/**
 * Component for toggling the DOM monitor
 */
export function DOMMonitorToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize state from storage
  useEffect(() => {
    const storage = new Storage()

    async function loadInitialState() {
      try {
        const enabled = await storage.get("dom_monitor_enabled")
        const loggingEnabled = await storage.get("dom_monitor_logging_enabled")
        setIsEnabled(!!enabled)
        setIsLoggingEnabled(!!loggingEnabled)
      } catch (error) {
        console.error("Error loading DOM monitor state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialState()
  }, [])

  // Toggle the DOM monitor
  const toggleDOMMonitor = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const newState = !isEnabled

      // Send message to background script
      await sendToBackground({
        name: "toggle-dom-monitor",
        body: {
          enabled: newState
        }
      })

      setIsEnabled(newState)
    } catch (error) {
      console.error("Error toggling DOM monitor:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, isLoading])

  // Toggle logging
  const toggleLogging = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const newState = !isLoggingEnabled

      // Send message to background script
      await sendToBackground({
        name: "toggle-dom-monitor",
        body: {
          toggleLogging: newState
        }
      })

      setIsLoggingEnabled(newState)
    } catch (error) {
      console.error("Error toggling DOM monitor logging:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggingEnabled, isLoading])

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isEnabled ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative",
                    isEnabled && "bg-green-500 hover:bg-green-600",
                    isLoading && "opacity-50 cursor-wait"
                  )}
                  onClick={toggleDOMMonitor}
                  disabled={isLoading}
                  aria-label={
                    isEnabled ? "Stop DOM Monitor" : "Start DOM Monitor"
                  }>
                  <Activity className="h-4 w-4" />
                  {isLoggingEnabled && isEnabled && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isEnabled ? "Stop DOM Monitor" : "Start DOM Monitor"}</p>
                <p className="text-xs mt-1">
                  Track DOM changes in real-time for accessibility testing
                </p>
                {isLoggingEnabled && (
                  <p className="text-xs mt-1 text-blue-500">
                    Logging is enabled
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={toggleDOMMonitor} disabled={isLoading}>
            <Activity className="mr-2 h-4 w-4" />
            <span>{isEnabled ? "Stop DOM Monitor" : "Start DOM Monitor"}</span>
          </ContextMenuItem>

          <ContextMenuCheckboxItem
            checked={isLoggingEnabled}
            onClick={toggleLogging}
            disabled={isLoading}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Console Logs</span>
          </ContextMenuCheckboxItem>

          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() =>
              window.open(
                "https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver",
                "_blank"
              )
            }>
            <Eye className="mr-2 h-4 w-4 text-green-500" />
            <span>About DOM Monitoring</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
