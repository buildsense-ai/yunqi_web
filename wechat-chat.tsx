"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Paperclip, Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  isDocument?: boolean
}

export default function WeChatConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "您好！我是您的智能助手，有什么可以帮您的吗？",
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [stage, setStage] = useState<"casual" | "construction" | "collecting" | "completed">("casual")
  const [constructionInfo, setConstructionInfo] = useState({
    projectName: "",
    location: "",
    supervisor: "",
    date: "",
    issues: "",
  })
  const [currentQuestion, setCurrentQuestion] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showDocPreview, setShowDocPreview] = useState(false)

  // Questions to ask when in construction mode
  const constructionQuestions = [
    { key: "projectName", question: "请问工程项目名称是什么？", isCritical: true },
    { key: "location", question: "请问工程地点在哪里？", isCritical: true },
    { key: "supervisor", question: "请问现场监理人员是谁？", isCritical: true },
    { key: "date", question: "请问旁站日期是什么时候？", isCritical: true },
    { key: "issues", question: "请问有哪些需要特别注意的问题或发现？", isCritical: false },
  ]

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle user input based on current stage
  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages([...messages, newUserMessage])

    // Process based on current stage
    setTimeout(() => {
      processMessage(input)
    }, 500)

    setInput("")
  }

  const isGenericAnswer = (input: string): boolean => {
    const genericResponses = [
      "ok",
      "OK",
      "Ok",
      "好的",
      "可以",
      "行",
      "没问题",
      "一切正常",
      "正常",
      "都好",
      "没事",
      "没有问题",
      "都OK",
      "都ok",
      "没啥问题",
      "没什么问题",
    ]
    return genericResponses.some((response) => input.includes(response))
  }

  const processMessage = (userInput: string) => {
    // Check for construction keywords if in casual mode
    if (stage === "casual") {
      const constructionKeywords = ["旁站", "工程", "监理", "建筑", "施工", "现场检查", "质量检查"]
      if (constructionKeywords.some((keyword) => userInput.includes(keyword))) {
        setStage("construction")
        const response: Message = {
          id: messages.length + 2,
          content: "我注意到您需要进行旁站记录。我会尽量简化流程，只询问必要信息。",
          sender: "assistant",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, response])

        // Start asking questions
        setTimeout(() => {
          askNextQuestion()
        }, 1000)
        return
      }

      // Casual conversation responses
      const casualResponses = [
        "今天天气真不错，有什么我能帮您的吗？",
        "您好！有什么问题需要解答吗？",
        "我是智能助手，随时为您服务！",
        "有什么有趣的事情想分享吗？",
        "我可以帮您查询信息、回答问题或者只是聊聊天。",
      ]

      const randomResponse = casualResponses[Math.floor(Math.random() * casualResponses.length)]
      const response: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    } else if (stage === "collecting") {
      // Get current question details
      const currentQuestionObj = constructionQuestions.find((q) => q.question === currentQuestion)
      const currentKey = currentQuestionObj?.key as keyof typeof constructionInfo

      if (currentKey) {
        // Check if answer is generic for non-critical questions
        if (!currentQuestionObj?.isCritical && isGenericAnswer(userInput)) {
          // Use default value for non-critical questions with generic answers
          const defaultValues: Record<string, string> = {
            issues: "现场施工符合规范要求，无特殊问题。",
            // Add other default values for non-critical fields as needed
          }

          setConstructionInfo((prev) => ({
            ...prev,
            [currentKey]: defaultValues[currentKey] || "正常",
          }))

          // Add assistant response acknowledging the generic answer
          const acknowledgment: Message = {
            id: messages.length + 2,
            content: "已记录为正常状态。",
            sender: "assistant",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, acknowledgment])
        } else {
          // Save the actual user input
          setConstructionInfo((prev) => ({
            ...prev,
            [currentKey]: userInput,
          }))
        }
      }

      // Ask next question or generate document
      setTimeout(() => {
        askNextQuestion()
      }, 800) // Reduced delay for faster conversation flow
    }
  }

  const askNextQuestion = () => {
    // Find which questions have been answered
    const answeredKeys = Object.entries(constructionInfo)
      .filter(([_, value]) => value !== "")
      .map(([key]) => key)

    // Check if user has been giving generic answers
    const recentMessages = messages.slice(-Math.min(4, messages.length))
    const recentUserMessages = recentMessages.filter((m) => m.sender === "user")
    const hasGenericPattern =
      recentUserMessages.length >= 2 && recentUserMessages.filter((m) => isGenericAnswer(m.content)).length >= 2

    // Find next question
    let nextQuestion = constructionQuestions.find((q) => !answeredKeys.includes(q.key))

    // If user is giving generic answers, skip non-critical questions
    if (hasGenericPattern && nextQuestion && !nextQuestion.isCritical) {
      // Auto-fill non-critical questions with default values
      const defaultValues: Record<string, string> = {
        issues: "现场施工符合规范要求，无特殊问题。",
        // Add other default values as needed
      }

      setConstructionInfo((prev) => ({
        ...prev,
        [nextQuestion.key]: defaultValues[nextQuestion.key] || "正常",
      }))

      // Find the next critical question instead
      nextQuestion = constructionQuestions.find((q) => !answeredKeys.includes(q.key) && q.isCritical)
    }

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion.question)
      setStage("collecting")
      const response: Message = {
        id: messages.length + 2,
        content: nextQuestion.question,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    } else {
      // All questions answered, generate document
      generateDocument()
    }
  }

  const generateDocument = () => {
    setStage("completed")

    // First send a processing message
    const processingMessage: Message = {
      id: messages.length + 2,
      content: "正在快速生成旁站记录文档，请稍候...",
      sender: "assistant",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, processingMessage])

    // Then send the document after a delay
    setTimeout(() => {
      const documentMessage: Message = {
        id: messages.length + 3,
        content: "旁站记录文档",
        sender: "assistant",
        timestamp: new Date(),
        isDocument: true,
      }
      setMessages((prev) => [...prev, documentMessage])

      // Follow up message
      const followUpMessage: Message = {
        id: messages.length + 4,
        content: `已为您快速生成旁站记录文档，包含了所有必要信息。您可以点击查看或下载。如有特殊情况需要补充，请告诉我。`,
        sender: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, followUpMessage])
    }, 1500) // Reduced delay for faster document generation
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  const toggleDocPreview = () => {
    setShowDocPreview(!showDocPreview)
  }

  return (
    <div className="flex flex-col h-[600px] max-w-md mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#2e3238] text-white p-3 flex items-center">
        <Button variant="ghost" size="icon" className="text-white">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 text-center font-medium">智能助手</div>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#ebebeb]">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "assistant" && (
              <Avatar className="h-10 w-10 mr-2">
                <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-[#95ec69] text-black"
                  : message.isDocument
                    ? "bg-white text-black"
                    : "bg-white text-black"
              }`}
            >
              {message.isDocument ? (
                <div>
                  <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDocPreview}>
                    <div className="bg-[#f1f1f1] p-2 rounded">
                      <Paperclip className="h-5 w-5 text-[#07c160]" />
                    </div>
                    <div>
                      <div className="font-medium">旁站记录.docx</div>
                      <div className="text-xs text-gray-500">点击查看文档</div>
                    </div>
                  </div>
                  {showDocPreview && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200 text-sm">
                      <h3 className="font-bold text-center mb-2">旁站记录</h3>
                      <p>
                        <strong>工程名称：</strong> {constructionInfo.projectName}
                      </p>
                      <p>
                        <strong>工程地点：</strong> {constructionInfo.location}
                      </p>
                      <p>
                        <strong>监理人员：</strong> {constructionInfo.supervisor}
                      </p>
                      <p>
                        <strong>旁站日期：</strong> {constructionInfo.date}
                      </p>
                      <p>
                        <strong>现场情况：</strong> {constructionInfo.issues || "现场施工符合规范要求，无特殊问题。"}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div>{message.content}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</div>
            </div>

            {message.sender === "user" && (
              <Avatar className="h-10 w-10 ml-2">
                <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-[#f5f5f5] border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="发送消息..."
            className="flex-1 bg-white"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-[#07c160] text-white hover:bg-[#06b057]">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
