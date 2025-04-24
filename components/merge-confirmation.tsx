"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface MergeConfirmationProps {
  isOpen: boolean
  selectedCount: number
  onConfirm: () => void
  onCancel: () => void
  isLoading: boolean
}

export default function MergeConfirmation({
  isOpen,
  selectedCount,
  onConfirm,
  onCancel,
  isLoading,
}: MergeConfirmationProps) {
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
              <h3 className="text-lg font-semibold text-center mb-2">合并卡片</h3>
              <p className="text-gray-600 text-center mb-6">
                您已选择 <span className="font-semibold text-[#007AFF]">{selectedCount}</span>{" "}
                张卡片进行合并。合并后将生成一张新卡片，原卡片将被标记为已合并。
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={onConfirm}
                  disabled={isLoading || selectedCount < 2}
                  className={`w-full py-2.5 px-4 rounded-full ${
                    selectedCount < 2 ? "bg-gray-300 text-gray-500" : "bg-[#007AFF] text-white hover:bg-blue-600"
                  } font-medium`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      合并中...
                    </div>
                  ) : (
                    "确认合并"
                  )}
                </button>
                <button
                  onClick={onCancel}
                  className="w-full py-2.5 px-4 rounded-full bg-gray-100 text-gray-800 font-medium"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
