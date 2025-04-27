"use client"

import { motion } from "framer-motion"
import { X, Download, FileText, ExternalLink } from "lucide-react"

interface DocumentDownloadDialogProps {
  isOpen: boolean
  onClose: () => void
  docData: { event_id: number; id: number; doc_url: string } | null
  error: string | null
}

export default function DocumentDownloadDialog({ isOpen, onClose, docData, error }: DocumentDownloadDialogProps) {
  if (!isOpen) return null

  const handleDownload = () => {
    if (docData?.doc_url) {
      window.open(docData.doc_url, "_blank")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-lg max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">文档生成完成</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="text-center text-red-500">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <X size={32} className="text-red-500" />
              </div>
              <p>{error}</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-green-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">文档已生成</h3>
              <p className="text-gray-600 mb-4">您可以点击下方按钮下载文档</p>

              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center px-4 py-2 bg-[#007AFF] text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  <span>下载文档</span>
                </button>
              </div>

              {docData?.doc_url && (
                <div className="mt-4 text-xs text-gray-500 break-all">
                  <p className="mb-1">或直接访问链接：</p>
                  <a
                    href={docData.doc_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#007AFF] flex items-center justify-center hover:underline"
                  >
                    <span className="truncate">{docData.doc_url}</span>
                    <ExternalLink size={12} className="ml-1 flex-shrink-0" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </motion.div>
    </div>
  )
}
