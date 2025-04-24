"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, FileText, Check } from "lucide-react"
import TemplateSelection from "@/components/template-selection"
import DocumentForm from "@/components/document-form"
import DocumentPreview from "@/components/document-preview"
import type { DocumentTemplate, DocumentData } from "@/types/document-template"
import type { Event } from "@/types/event"
import { generateDocument } from "@/utils/document-generator"

// Template definitions
const documentTemplates: DocumentTemplate[] = [
  {
    id: "inspection-record",
    name: "巡视记录",
    description: "用于记录工程巡视情况的标准表格",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UbZFLHYLxrOh0yvbCSk2blLTOem9Bh.png",
    requiredFields: ["projectName", "inspectionLocation", "inspectionDate", "responsiblePerson"],
  },
  {
    id: "supervision-notification",
    name: "监理通知单",
    description: "用于向施工单位发出监理通知的标准表格",
    thumbnail: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KNdxV69wCVzXJuICRDIkjRYcp9zNBn.png",
    requiredFields: ["projectName", "projectNumber", "inspectionDate", "projectManager", "chiefEngineer"],
  },
]

// Template preview images
const templateImages: Record<string, string[]> = {
  "inspection-record": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-UbZFLHYLxrOh0yvbCSk2blLTOem9Bh.png",
  ],
  "supervision-notification": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KNdxV69wCVzXJuICRDIkjRYcp9zNBn.png",
  ],
}

export default function GenerateDocumentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventIds = searchParams.get("eventIds")?.split(",").map(Number) || []

  // Add a ref to track if we've already fetched events
  const fetchedRef = useRef(false)

  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Fetch selected events only once when component mounts
  useEffect(() => {
    if (eventIds.length > 0 && !fetchedRef.current) {
      fetchedRef.current = true
      fetchSelectedEvents()
    } else if (eventIds.length === 0) {
      setLoading(false)
    }
  }, [eventIds]) // Only depend on eventIds

  const fetchSelectedEvents = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/events")
      const allEvents = response.data.events

      // Filter events by selected IDs
      const filteredEvents = allEvents.filter((event: Event) => eventIds.includes(event.id))
      setSelectedEvents(filteredEvents)
      setError(null)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("获取事件数据失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
  }

  const handleFormDataChange = (data: DocumentData) => {
    setDocumentData(data)
  }

  const handleGenerateDocument = async () => {
    if (!documentData || !selectedTemplate) {
      setToast({ message: "请先选择模板并填写表单", type: "error" })
      return
    }

    // Check if all required fields are filled
    const requiredFields = selectedTemplate.requiredFields
    const missingFields = requiredFields.filter((field) => {
      const fieldData = documentData.fields[field]
      return !fieldData || !fieldData.value
    })

    if (missingFields.length > 0) {
      setToast({ message: "请填写所有必填字段", type: "error" })
      return
    }

    setIsGenerating(true)
    try {
      await generateDocument(documentData, selectedEvents)
      setToast({ message: "文档生成成功", type: "success" })
    } catch (err) {
      console.error("Error generating document:", err)
      setToast({ message: "文档生成失败，请重试", type: "error" })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      {/* iOS-style header */}
      <div className="bg-white py-3 px-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/cards" className="text-[#007AFF] text-sm font-medium flex items-center">
            <ChevronLeft size={16} />
            <span>返回</span>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-lg">生成文档</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateDocument}
            disabled={isGenerating || !documentData || !selectedTemplate}
            className={`flex items-center px-4 py-1.5 rounded-full ${
              isGenerating || !documentData || !selectedTemplate
                ? "bg-gray-200 text-gray-500"
                : "bg-[#007AFF] text-white"
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                <span>生成中...</span>
              </>
            ) : (
              <>
                <FileText size={16} className="mr-1" />
                <span>生成文档</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
            {error}
            <button onClick={fetchSelectedEvents} className="block mx-auto mt-2 text-[#007AFF] font-medium">
              重试
            </button>
          </div>
        ) : eventIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>请先选择要生成文档的卡片</p>
            <Link href="/cards" className="mt-2 text-[#007AFF] font-medium">
              返回选择卡片
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Selected events summary */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-lg mb-2">已选择的卡片 ({selectedEvents.length})</h2>
              <div className="space-y-2">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Check size={16} className="text-green-500" />
                    <span>{event.summary}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Template selection */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="font-semibold text-lg mb-4">选择文档模板</h2>
              <TemplateSelection templates={documentTemplates} onSelectTemplate={handleSelectTemplate} />
            </div>

            {/* Document form */}
            {selectedTemplate && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-semibold text-lg mb-4">填写文档信息</h2>
                <DocumentForm
                  template={selectedTemplate}
                  selectedEvents={selectedEvents}
                  onFormDataChange={handleFormDataChange}
                />
              </div>
            )}

            {/* Document preview */}
            {selectedTemplate && documentData && (
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h2 className="font-semibold text-lg mb-4">文档预览</h2>
                <DocumentPreview documentData={documentData} templateImages={templateImages[selectedTemplate.id]} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
