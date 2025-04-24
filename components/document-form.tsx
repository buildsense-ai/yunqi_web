"use client"

import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, AlertCircle } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DocumentTemplate, DocumentField, DocumentData } from "@/types/document-template"
import type { Event } from "@/types/event"

interface DocumentFormProps {
  template: DocumentTemplate
  selectedEvents: Event[]
  onFormDataChange: (data: DocumentData) => void
}

export default function DocumentForm({ template, selectedEvents, onFormDataChange }: DocumentFormProps) {
  const [formFields, setFormFields] = useState<Record<string, DocumentField>>({})
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const initializedRef = useRef(false)

  // Initialize form fields based on template - only run once when template or events change
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initialFields: Record<string, DocumentField> = {}

    // Add template required fields
    template.requiredFields.forEach((fieldKey) => {
      initialFields[fieldKey] = {
        key: fieldKey,
        label: getFieldLabel(fieldKey),
        type: getFieldType(fieldKey),
        required: true,
        value: null,
      }
    })

    // Add fields from selected events
    if (selectedEvents.length > 0) {
      const event = selectedEvents[0]

      // Map event fields to document fields
      if (event.summary) {
        initialFields["projectName"] = {
          key: "projectName",
          label: "工程项目名称",
          type: "text",
          required: true,
          value: event.summary,
        }
      }

      if (event.category) {
        initialFields["category"] = {
          key: "category",
          label: "类别",
          type: "text",
          required: false,
          value: event.category,
        }
      }

      // Add event content as description
      if (event.messages && event.messages.length > 0) {
        initialFields["content"] = {
          key: "content",
          label: "内容",
          type: "text",
          required: false,
          value: event.messages.map((m) => m.content).join("\n"),
        }
      }
    }

    setFormFields(initialFields)
  }, [template, selectedEvents])

  // Update parent component when form data changes - use a ref to prevent unnecessary calls
  const formDataRef = useRef<DocumentData | null>(null)

  useEffect(() => {
    validateForm()

    const documentData = {
      templateId: template.id,
      fields: formFields,
      eventIds: selectedEvents.map((event) => event.id),
    }

    // Only update if data has changed
    if (JSON.stringify(documentData) !== JSON.stringify(formDataRef.current)) {
      formDataRef.current = documentData
      onFormDataChange(documentData)
    }
  }, [formFields, template.id, selectedEvents, onFormDataChange])

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      responsiblePerson: "巡视监理人员",
      inspectionDate: "巡视日期",
      inspectionLocation: "巡视施工部位",
      constructionUnit: "施工单位",
      projectName: "工程项目名称",
      projectNumber: "编号",
      content: "内容",
      projectManager: "项目监理机构",
      chiefEngineer: "总监理工程师",
    }

    return labels[key] || key
  }

  const getFieldType = (key: string): "text" | "date" | "checkbox" | "person" | "image" => {
    if (key.toLowerCase().includes("date")) return "date"
    if (
      key.toLowerCase().includes("person") ||
      key.toLowerCase().includes("engineer") ||
      key.toLowerCase().includes("manager")
    )
      return "person"
    if (key.toLowerCase().includes("check") || key.toLowerCase().includes("confirm")) return "checkbox"
    if (key.toLowerCase().includes("image") || key.toLowerCase().includes("photo")) return "image"
    return "text"
  }

  const handleFieldChange = (key: string, value: string | boolean | Date | null) => {
    setFormFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
      },
    }))
  }

  const validateForm = () => {
    const errors: string[] = []

    // Check required fields
    Object.values(formFields).forEach((field) => {
      if (field.required && (field.value === null || field.value === undefined || field.value === "")) {
        errors.push(`${field.label}是必填项`)
      }
    })

    setValidationErrors(errors)
    return errors.length === 0
  }

  return (
    <div className="space-y-6">
      {/* Validation errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600 font-medium mb-2">
            <AlertCircle size={16} />
            <span>请填写以下必填字段：</span>
          </div>
          <ul className="list-disc pl-5 text-sm text-red-600">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.values(formFields).map((field) => (
          <div key={field.key} className="space-y-2">
            <label htmlFor={field.key} className="block text-sm font-medium text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                id={field.key}
                value={(field.value as string) || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
              />
            )}

            {field.type === "person" && (
              <input
                type="text"
                id={field.key}
                value={(field.value as string) || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                placeholder="请输入姓名"
              />
            )}

            {field.type === "date" && (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id={field.key}
                    className={cn(
                      "w-full flex items-center justify-start px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent text-left",
                      !field.value && "text-gray-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value as Date, "yyyy年MM月dd日") : "选择日期"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={(field.value as Date) || undefined}
                    onSelect={(date) => handleFieldChange(field.key, date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            {field.type === "checkbox" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={field.key}
                  checked={(field.value as boolean) || false}
                  onChange={(e) => handleFieldChange(field.key, e.target.checked)}
                  className="h-4 w-4 text-[#007AFF] focus:ring-[#007AFF] border-gray-300 rounded"
                />
                <label htmlFor={field.key} className="ml-2 block text-sm text-gray-700">
                  确认
                </label>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
