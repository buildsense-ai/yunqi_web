"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { DocumentData } from "@/types/document-template"

interface DocumentPreviewProps {
  documentData: DocumentData
  templateImages: string[]
}

export default function DocumentPreview({ documentData, templateImages }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < templateImages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="relative bg-gray-100 rounded-xl p-4 flex flex-col items-center">
      {/* Page navigation */}
      <div className="flex justify-between w-full mb-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`flex items-center ${currentPage === 0 ? "text-gray-400" : "text-[#007AFF]"}`}
        >
          <ChevronLeft size={16} />
          <span>上一页</span>
        </button>

        <span className="text-sm text-gray-500">
          第 {currentPage + 1} 页，共 {templateImages.length} 页
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === templateImages.length - 1}
          className={`flex items-center ${currentPage === templateImages.length - 1 ? "text-gray-400" : "text-[#007AFF]"}`}
        >
          <span>下一页</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Document preview */}
      <div className="relative w-full max-w-md aspect-[1/1.414] bg-white shadow-lg">
        <Image
          src={templateImages[currentPage] || "/placeholder.svg"}
          alt={`Template page ${currentPage + 1}`}
          fill
          className="object-contain"
        />

        {/* Overlay with form data */}
        <div className="absolute inset-0">
          {/* This would be where we position the form data on top of the template */}
          {/* For a real implementation, we would need to know the exact positions for each template */}
        </div>
      </div>
    </div>
  )
}
