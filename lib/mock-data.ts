import type { Message } from "@/types/message"

export const mockMessages: Message[] = [
  {
    message_id: "mock_1",
    msg_type: "text",
    create_time: Date.now() - 3600000, // 1 hour ago
    sender_id: "mock_user_1",
    message_content: {
      text: "Hello everyone! Welcome to our group chat.",
    },
    image_url: null,
    status: "1",
  },
  {
    message_id: "mock_2",
    msg_type: "text",
    create_time: Date.now() - 3500000,
    sender_id: "mock_user_2",
    message_content: {
      text: "Hi there! Thanks for adding me to this group.",
    },
    image_url: null,
    status: "1",
  },
  {
    message_id: "mock_3",
    msg_type: "text",
    create_time: Date.now() - 3400000,
    sender_id: "mock_user_3",
    message_content: {
      text: "I'm excited to be here! What's everyone working on?",
    },
    image_url: null,
    status: "1",
  },
  {
    message_id: "mock_4",
    msg_type: "text",
    create_time: Date.now() - 3300000,
    sender_id: "current-user",
    message_content: {
      text: "I'm working on a new iOS-style chat interface. It's coming along nicely!",
    },
    image_url: null,
    status: "1",
  },
  {
    message_id: "mock_5",
    msg_type: "text",
    create_time: Date.now() - 3200000,
    sender_id: "mock_user_1",
    message_content: {
      text: "That sounds awesome! Can't wait to see it.",
    },
    image_url: null,
    status: "1",
  },
]
