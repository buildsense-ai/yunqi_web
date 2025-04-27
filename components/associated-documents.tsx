"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FileText, ExternalLink } from "lucide-react"
import type { AutoDocument } from "@/types/auto-document"
import { useDocuments } from "@/contexts/document-context"

interface AssociatedDocumentsProps {
  eventId: number
}

export default function AssociatedDocuments({ eventId }: AssociatedDocumentsProps) {
  const [documents, setDocuments] = useState<AutoDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { documentRefreshCounter } = useDocuments()

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/documents")
        // Filter documents for this event
        const eventDocuments = response.data.filter((doc: AutoDocument) => doc.event_id === eventId)
        setDocuments(eventDocuments)
        setError(null)
      } catch (err) {
        console.error("Error fetching documents:", err)
        setError("获取文档失败")
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [eventId, documentRefreshCounter])

  // Extract filename from URL
  const getFileName = (url: string): string => {
    const parts = url.split("/")
    return parts[parts.length - 1]
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

  if (documents.length === 0) {
    return null
  }

  return (
    <div className="mt-3 space-y-2">
      <h4 className="text-sm font-medium text-gray-700">自动生成文档</h4>
      <div className="space-y-2">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.doc_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
              <FileText size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{getFileName(doc.doc_url)}</p>
              <p className="text-xs text-gray-500">自动生成文档</p>
            </div>
            <ExternalLink size={14} className="text-gray-400 ml-2 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
