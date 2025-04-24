export interface Message {
  message_id: string
  msg_type: string
  create_time: number
  sender_id: string
  message_content: {
    text: string
  }
  image_url: string | null
  status: string
}
