export interface EventMessage {
  type: string
  content: string
  sender_id: string
  timestamp: string
  message_id: string
}

export interface EventImage {
  image_key: string
  sender_id: string
  timestamp: string
  image_data: string
  message_id: string
}

export interface EventDocument {
  document_key: string
  sender_id: string
  timestamp: string
  document_name: string
  message_id: string
}

export interface Event {
  category: string
  summary: string
  id: number
  is_merged: boolean
  create_time: string
  messages: EventMessage[]
  candidate_images?: EventImage[]
  documents?: EventDocument[]
  status: string
  update_time: string
}

export interface EventsResponse {
  events: Event[]
}
