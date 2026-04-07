// components/shared/KeyboardShortcuts.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Command, Keyboard, Plus, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Shortcut = {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  action: () => void
  description: string
}

interface KeyboardShortcutsProps {
  onNew?: () => void
  customShortcuts?: Shortcut[]
}

export default function KeyboardShortcuts({ onNew, customShortcuts = [] }: KeyboardShortcutsProps) {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)

  const defaultShortcuts: Shortcut[] = [
    {
      key: "?",
      action: () => setShowHelp(true),
      description: "Show keyboard shortcuts",
    },
    {
      key: "n",
      action: () => {
        if (onNew) {
          onNew()
        } else {
          // Default: show a menu or navigate to quick create
          // For now, just open help to show options
          setShowHelp(true)
        }
      },
      description: "Create new (client, lead, project, or invoice)",
    },
    {
      key: "Escape",
      action: () => {
        // Close any open modals/dialogs
        document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
      },
      description: "Close modal / dialog",
    },
    {
      key: "d",
      ctrl: true,
      action: () => router.push("/dashboard"),
      description: "Go to Dashboard",
    },
    {
      key: "c",
      ctrl: true,
      action: () => router.push("/clients"),
      description: "Go to Clients",
    },
    {
      key: "l",
      ctrl: true,
      action: () => router.push("/leads"),
      description: "Go to Leads",
    },
    {
      key: "p",
      ctrl: true,
      action: () => router.push("/projects"),
      description: "Go to Projects",
    },
    {
      key: "i",
      ctrl: true,
      action: () => router.push("/invoices"),
      description: "Go to Invoices",
    },
    {
      key: "r",
      ctrl: true,
      action: () => router.push("/reminders"),
      description: "Go to Reminders",
    },
    {
      key: "s",
      ctrl: true,
      action: () => router.push("/settings"),
      description: "Go to Settings",
    },
  ]

  const allShortcuts = [...defaultShortcuts, ...customShortcuts]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      for (const shortcut of allShortcuts) {
        let matches = true

        if (shortcut.ctrl && !(e.ctrlKey || e.metaKey)) matches = false
        if (shortcut.alt && !e.altKey) matches = false
        if (shortcut.shift && !e.shiftKey) matches = false

        const keyMatches = shortcut.key === "Escape" 
          ? e.key === "Escape"
          : e.key.toLowerCase() === shortcut.key.toLowerCase()

        if (matches && keyMatches) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [allShortcuts])

  // Format shortcut display
  const formatShortcut = (shortcut: Shortcut) => {
    const parts = []
    if (shortcut.ctrl) parts.push("⌘")
    if (shortcut.alt) parts.push("⌥")
    if (shortcut.shift) parts.push("⇧")
    parts.push(shortcut.key === "Escape" ? "Esc" : shortcut.key.toUpperCase())
    return parts.join(" + ")
  }

  return (
    <>
      {/* Help Modal */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Navigation</p>
              {allShortcuts
                .filter(s => s.description.includes("Go to"))
                .map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded-md">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
            </div>
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">Actions</p>
              {allShortcuts
                .filter(s => !s.description.includes("Go to"))
                .map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-gray-600">{shortcut.description}</span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 rounded-md">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                💡 On mobile, tap the floating action button for quick actions
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
              }
