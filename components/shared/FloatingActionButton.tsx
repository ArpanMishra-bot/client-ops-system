// components/shared/FloatingActionButton.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Users, TrendingUp, FolderKanban, FileText, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Action = {
  label: string
  icon: React.ReactNode
  href: string
  description: string
}

const actions: Action[] = [
  { label: "Add Client", icon: <Users className="h-5 w-5" />, href: "/clients/new", description: "Create new client profile" },
  { label: "Add Lead", icon: <TrendingUp className="h-5 w-5" />, href: "/leads/new", description: "Track new opportunity" },
  { label: "Create Project", icon: <FolderKanban className="h-5 w-5" />, href: "/projects/new", description: "Start a new project" },
  { label: "Create Invoice", icon: <FileText className="h-5 w-5" />, href: "/invoices/new", description: "Send an invoice" },
  { label: "Add Reminder", icon: <Bell className="h-5 w-5" />, href: "/reminders", description: "Set a reminder" },
]

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleAction = (href: string) => {
    setIsOpen(false)
    router.push(href)
  }

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="absolute bottom-16 right-0 mb-2 space-y-2"
            >
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleAction(action.href)}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg border border-gray-100 w-48 active:scale-95 transition-all duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center active:scale-95 transition-all duration-200"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Plus className="h-6 w-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  )
}
