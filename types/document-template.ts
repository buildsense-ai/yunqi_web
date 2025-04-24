export interface DocumentTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  requiredFields: string[]
}

export interface DocumentField {
  key: string
  label: string
  type: "text" | "date" | "checkbox" | "person" | "image"
  required: boolean
  value?: string | boolean | Date | null
}

export interface DocumentData {
  templateId: string
  fields: Record<string, DocumentField>
  eventIds: number[]
}
