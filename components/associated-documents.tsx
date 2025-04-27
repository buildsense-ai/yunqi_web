"use client"

import { useState, useEffect } from "react"
import { FileText, ExternalLink, Trash2 } from "lucide-react"
import { useDocuments } from "@/contexts/document-context"
import { useCache } from "@/contexts/cache-context"
import axiosClient from "@/utils/axios-client"

interface AssociatedDocumentsProps {
  eventId: number
}

export default function AssociatedDocuments({ eventId }: AssociatedDocumentsProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingDocId, setDeletingDocId] = useState<number | null>(null)
  const [showToast, setShowToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const { documentRefreshCounter, refreshDocuments } = useDocuments()
  const { documents, setDocuments, isCacheStale } = useCache()

  // Filter documents for this event
  const eventDocuments = documents.filter((doc) => doc.event_id === eventId)

  useEffect(() => {
    const fetchDocuments = async () => {
      // Skip fetching if cache is fresh
      if (!isCacheStale("documents")) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await axiosClient.get("/api/documents")
        setDocuments(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("获取文档失败")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [eventId, documentRefreshCounter, isCacheStale, setDocuments])

  // Extract filename from URL
  const getFileName = (url: string): string => {
    const parts = url.split("/")
    return parts[parts.length - 1]
  }

  // Handle document deletion
  const handleDeleteDocument = async (docId: number) => {
    try {
      setDeletingDocId(docId)
      await axiosClient.delete(`/api/documents/${docId}`)

      // Update local state to remove the deleted document
      setDocuments(documents.filter((doc) => doc.id !== docId))

      // Show success toast
      setShowToast({ message: "文档已成功删除", type: "success" })

      // Refresh documents list
      refreshDocuments()
    } catch (error) {
      console.error("Error deleting document:", error)
      setShowToast({ message: "删除文档失败", type: "error" })
    } finally {
      setDeletingDocId(null)

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(null)
      }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="mt-3 flex items-center justify-center py-2">
        <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return <div className="mt-3 text-xs text-red-500 py-2">{error}</div>
  }

  if (eventDocuments.length === 0) {
    return null
  }

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">自动生成文档</h4>
      <div className="space-y-2">
        {eventDocuments.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors group relative"
          >
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
              <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <a
                href={doc.doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm truncate block"
              >
                {getFileName(doc.doc_url)}
                <ExternalLink size={14} className="text-gray-400 ml-2 inline-block" />
              </a>
              <p className="text-xs text-gray-500">自动生成文档</p>
            </div>

            {/* Delete button */}
            <div className="ml-2">
              {deletingDocId === doc.id ? (
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDeleteDocument(doc.id)
                  }}
                  className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="删除文档"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toast notification */}
      {showToast && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 ${
            showToast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {showToast.message}
        </div>
      )}
    </div>
  )
}
