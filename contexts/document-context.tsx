"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DocumentContextType {
  refreshDocuments: () => void
  documentRefreshCounter: number
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documentRefreshCounter, setDocumentRefreshCounter] = useState(0)

  const refreshDocuments = () => {
    setDocumentRefreshCounter((prev) => prev + 1)
  }

  return (
    <DocumentContext.Provider value={{ refreshDocuments, documentRefreshCounter }}>{children}</DocumentContext.Provider>
  )
}

export function useDocuments() {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider")
  }
  return context
}
