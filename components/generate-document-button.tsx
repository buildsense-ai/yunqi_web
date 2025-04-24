"use client"
import { useRouter } from "next/navigation"
import { FileText } from "lucide-react"

interface GenerateDocumentButtonProps {
  selectedEventIds: number[]
}

export default function GenerateDocumentButton({ selectedEventIds }: GenerateDocumentButtonProps) {
  const router = useRouter()

  const handleGenerateDocument = () => {
    if (selectedEventIds.length === 0) return

    // Navigate to document generation page with selected event IDs
    router.push(`/generate-document?eventIds=${selectedEventIds.join(",")}`)
  }

  return (
    <button
      onClick={handleGenerateDocument}
      disabled={selectedEventIds.length === 0}
      className={`flex items-center ${selectedEventIds.length === 0 ? "text-gray-400" : "text-[#007AFF]"}`}
    >
      <FileText size={16} className="mr-1" />
      <span>生成文档</span>
    </button>
  )
}
