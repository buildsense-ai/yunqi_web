"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Message } from "@/types/message"
import type { Event } from "@/types/event"
import type { AutoDocument } from "@/types/auto-document"

interface CacheContextType {
  // Messages cache
  messages: Message[]
  setMessages: (messages: Message[]) => void
  messagesTimestamp: number | null
  invalidateMessages: () => void

  // Events cache
  events: Event[]
  setEvents: (events: Event[]) => void
  eventsTimestamp: number | null
  invalidateEvents: () => void

  // Documents cache
  documents: AutoDocument[]
  setDocuments: (documents: AutoDocument[]) => void
  documentsTimestamp: number | null
  invalidateDocuments: () => void

  // Cache status
  isCacheStale: (cache: "messages" | "events" | "documents", maxAge?: number) => boolean
}

const CacheContext = createContext<CacheContextType | undefined>(undefined)

// Default cache expiration time (5 minutes)
const DEFAULT_CACHE_MAX_AGE = 5 * 60 * 1000

export function CacheProvider({ children }: { children: ReactNode }) {
  // Messages cache
  const [messages, setMessages] = useState<Message[]>([])
  const [messagesTimestamp, setMessagesTimestamp] = useState<number | null>(null)

  // Events cache
  const [events, setEvents] = useState<Event[]>([])
  const [eventsTimestamp, setEventsTimestamp] = useState<number | null>(null)

  // Documents cache
  const [documents, setDocuments] = useState<AutoDocument[]>([])
  const [documentsTimestamp, setDocumentsTimestamp] = useState<number | null>(null)

  // Update messages with timestamp
  const updateMessages = useCallback((newMessages: Message[]) => {
    setMessages(newMessages)
    setMessagesTimestamp(Date.now())
  }, [])

  // Update events with timestamp
  const updateEvents = useCallback((newEvents: Event[]) => {
    setEvents(newEvents)
    setEventsTimestamp(Date.now())
  }, [])

  // Update documents with timestamp
  const updateDocuments = useCallback((newDocuments: AutoDocument[]) => {
    setDocuments(newDocuments)
    setDocumentsTimestamp(Date.now())
  }, [])

  // Invalidate caches
  const invalidateMessages = useCallback(() => {
    setMessagesTimestamp(null)
  }, [])

  const invalidateEvents = useCallback(() => {
    setEventsTimestamp(null)
  }, [])

  const invalidateDocuments = useCallback(() => {
    setDocumentsTimestamp(null)
  }, [])

  // Check if cache is stale
  const isCacheStale = useCallback(
    (cache: "messages" | "events" | "documents", maxAge: number = DEFAULT_CACHE_MAX_AGE): boolean => {
      const timestamp =
        cache === "messages" ? messagesTimestamp : cache === "events" ? eventsTimestamp : documentsTimestamp

      if (timestamp === null) return true

      const now = Date.now()
      return now - timestamp > maxAge
    },
    [messagesTimestamp, eventsTimestamp, documentsTimestamp],
  )

  return (
    <CacheContext.Provider
      value={{
        messages,
        setMessages: updateMessages,
        messagesTimestamp,
        invalidateMessages,

        events,
        setEvents: updateEvents,
        eventsTimestamp,
        invalidateEvents,

        documents,
        setDocuments: updateDocuments,
        documentsTimestamp,
        invalidateDocuments,

        isCacheStale,
      }}
    >
      {children}
    </CacheContext.Provider>
  )
}

export function useCache() {
  const context = useContext(CacheContext)
  if (context === undefined) {
    throw new Error("useCache must be used within a CacheProvider")
  }
  return context
}
