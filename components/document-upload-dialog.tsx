"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { X, Upload, File } from "lucide-react"
import axiosClient from "@/utils/axios-client"

interface DocumentUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  eventId: number
  onSuccess: () => void
}

export default function DocumentUploadDialog({ isOpen, onClose, eventId, onSuccess }: DocumentUploadDialogProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSelectFile = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("请选择一个文档文件")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      // Read the file as binary data
      const fileBuffer = await selectedFile.arrayBuffer()

      // Send the binary data to the API
      await axiosClient.post(`/api/events/${eventId}/documents`, fileBuffer, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      })

      onSuccess()
      onClose()
    } catch (err) {
      console.error("Error uploading document:", err)
      setError("上传文档失败，请重试")
    } finally {
      setIsUploading(false)
    }
  }

  if (!isOpen) return null

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
          <h2 className="text-lg font-semibold">上传文档</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#007AFF] transition-colors cursor-pointer"
            onClick={handleSelectFile}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".doc,.docx,.pdf"
            />
            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-3">
              <Upload size={24} />
            </div>
            {selectedFile ? (
              <div className="flex items-center justify-center mt-2">
                <File size={16} className="text-blue-500 mr-2" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
              </div>
            ) : (
              <>
                <p className="text-sm font-medium">点击或拖拽文件到此处上传</p>
                <p className="text-xs text-gray-500 mt-1">支持 .doc, .docx, .pdf 文件</p>
              </>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`w-full py-2.5 px-4 rounded-full ${
              !selectedFile || isUploading ? "bg-gray-200 text-gray-500" : "bg-[#007AFF] text-white"
            } font-medium`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                上传中...
              </div>
            ) : (
              "上传文档"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
