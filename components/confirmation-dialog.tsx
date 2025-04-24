"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-xl shadow-lg max-w-sm w-full overflow-hidden"
          >
            {/* Close button */}
            <button onClick={onCancel} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
              <p className="text-gray-600 text-center mb-6">{message}</p>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={onConfirm}
                  className="w-full py-2.5 px-4 rounded-full bg-red-500 text-white font-medium"
                >
                  {confirmText}
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-2.5 px-4 rounded-full bg-gray-100 text-gray-800 font-medium"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
