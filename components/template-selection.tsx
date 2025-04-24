"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import type { DocumentTemplate } from "@/types/document-template"

interface TemplateSelectionProps {
  templates: DocumentTemplate[]
  onSelectTemplate: (template: DocumentTemplate) => void
}

export default function TemplateSelection({ templates, onSelectTemplate }: TemplateSelectionProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplateId(template.id)
    onSelectTemplate(template)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <motion.div
          key={template.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer border-2 ${
            selectedTemplateId === template.id ? "border-[#007AFF]" : "border-transparent"
          }`}
          onClick={() => handleSelectTemplate(template)}
        >
          {/* Template thumbnail */}
          <div className="relative h-60 w-full">
            <Image src={template.thumbnail || "/placeholder.svg"} alt={template.name} fill className="object-contain" />
          </div>

          {/* Template info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{template.description}</p>
          </div>

          {/* Selection indicator */}
          {selectedTemplateId === template.id && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#007AFF] flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
