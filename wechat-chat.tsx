"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Paperclip, Send, User, HelpCircle, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: Date
  isDocument?: boolean
  isGuidance?: boolean
  isReminder?: boolean
}

export default function WeChatConversation() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "您好！我是您的专业旁站记录助手，可以帮助您完成规范的旁站记录。请问有什么可以帮您的吗？",
      sender: "assistant",
      timestamp: new Date(new Date().getTime() - 3600000), // 1 hour ago
    },
  ])
  const [input, setInput] = useState("")
  const [stage, setStage] = useState<"casual" | "construction" | "collecting" | "completed" | "paused">("casual")
  const [constructionInfo, setConstructionInfo] = useState({
    projectName: "",
    location: "",
    supervisor: "",
    date: "",
    concreteQuality: "",
    reinforcementPlacement: "",
    formworkCondition: "",
    safetyMeasures: "",
    qualityIssues: "",
  })
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentField, setCurrentField] = useState<keyof typeof constructionInfo | null>(null)
  const [lastActivityTime, setLastActivityTime] = useState<Date>(new Date())
  const [showDocPreview, setShowDocPreview] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Professional guidance for each field
  const fieldGuidance: Record<string, string> = {
    concreteQuality:
      "检查混凝土的坍落度、强度等级、配合比是否符合设计要求。观察混凝土运输、浇筑过程是否规范，有无离析现象。",
    reinforcementPlacement:
      "检查钢筋的规格、间距、保护层厚度是否符合设计图纸要求。观察钢筋的连接方式、搭接长度是否符合规范。",
    formworkCondition:
      "检查模板的支撑系统是否稳固，模板表面是否平整、清洁。观察模板的刚度、密封性是否良好，有无漏浆现象。",
    safetyMeasures:
      "检查施工现场的安全防护措施是否到位，如临边防护、高处作业防护、用电安全等。观察工人是否佩戴安全帽等防护装备。",
    qualityIssues: "记录施工过程中发现的任何质量问题，如混凝土蜂窝麻面、钢筋锈蚀、模板变形等，并注明处理方法。",
  }

  // Questions to ask when in construction mode
  const constructionQuestions = [
    { key: "projectName", question: "请问工程项目名称是什么？" },
    { key: "location", question: "请问工程地点在哪里？" },
    { key: "supervisor", question: "请问现场监理人员是谁？" },
    { key: "date", question: "请问旁站日期是什么时候？" },
    {
      key: "concreteQuality",
      question: "请详细描述混凝土的质量情况（包括坍落度、强度等级、浇筑过程等）：",
    },
    {
      key: "reinforcementPlacement",
      question: "请详细描述钢筋布置情况（包括规格、间距、保护层厚度等）：",
    },
    {
      key: "formworkCondition",
      question: "请详细描述模板状况（包括支撑系统、表面情况等）：",
    },
    {
      key: "safetyMeasures",
      question: "请详细描述安全措施落实情况（包括临边防护、高处作业防护等）：",
    },
    {
      key: "qualityIssues",
      question: "请描述发现的质量问题及处理方法（如无问题，请详细说明检查过程和结果）：",
    },
  ]

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Function to simulate time jumps for demo purposes
  const simulateTimeJump = (hourOffset: number) => {
    const jumpTime = new Date()
    jumpTime.setHours(jumpTime.getHours() + hourOffset)

    // Add a system message indicating time has passed
    const timeJumpMessage: Message = {
      id: messages.length + 1,
      content: `${hourOffset}小时后...`,
      sender: "system",
      timestamp: jumpTime,
    }
    setMessages((prev) => [...prev, timeJumpMessage])
    setLastActivityTime(jumpTime)
  }

  // Handle user input based on current stage
  const handleSendMessage = () => {
    if (!input.trim()) return

    const now = new Date()

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: now,
    }
    setMessages([...messages, newUserMessage])
    setLastActivityTime(now)

    // Process based on current stage
    setTimeout(() => {
      processMessage(input, now)
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

  const processMessage = (userInput: string, timestamp: Date) => {
    // Check if conversation was paused and needs to be resumed
    if (stage === "paused") {
      const timeDiff = (timestamp.getTime() - lastActivityTime.getTime()) / (1000 * 60) // in minutes

      if (timeDiff > 30) {
        // If more than 30 minutes have passed
        const resumeMessage: Message = {
          id: messages.length + 2,
          content: `我们继续之前的旁站记录。您刚才回答了关于${getFieldName(currentField)}的问题。`,
          sender: "assistant",
          timestamp: new Date(timestamp.getTime() + 1000), // 1 second after user message
        }
        setMessages((prev) => [...prev, resumeMessage])

        // Continue with the next question
        setTimeout(() => {
          askNextQuestion(timestamp)
        }, 1000)
        return
      }
    }

    // Check for construction keywords if in casual mode
    if (stage === "casual") {
      const constructionKeywords = ["旁站", "工程", "监理", "建筑", "施工", "现场检查", "质量检查"]
      if (constructionKeywords.some((keyword) => userInput.includes(keyword))) {
        setStage("construction")
        const response: Message = {
          id: messages.length + 2,
          content:
            "我将帮助您完成专业的旁站记录。作为实习生，详细记录现场情况对您的专业成长非常重要。我会引导您一步步完成规范的旁站记录。",
          sender: "assistant",
          timestamp: new Date(timestamp.getTime() + 1000), // 1 second after user message
        }
        setMessages((prev) => [...prev, response])

        // Start asking questions
        setTimeout(() => {
          askNextQuestion(timestamp)
        }, 1000)
        return
      }

      // Casual conversation responses
      const casualResponses = [
        "我是专业的旁站记录助手，可以帮您记录施工现场的各项检查情况。需要开始记录吗？",
        "您好！需要我帮您进行旁站记录吗？我可以引导您完成专业规范的记录。",
        "我可以帮助您完成旁站记录，包括混凝土质量、钢筋布置、模板状况等专业内容。",
        "作为实习生，详细的旁站记录对您的专业成长很重要。需要我帮您开始记录吗？",
        "我可以指导您如何进行专业的旁站记录，这对工程质量控制非常重要。",
      ]

      const randomResponse = casualResponses[Math.floor(Math.random() * casualResponses.length)]
      const response: Message = {
        id: messages.length + 2,
        content: randomResponse,
        sender: "assistant",
        timestamp: new Date(timestamp.getTime() + 1000), // 1 second after user message
      }
      setMessages((prev) => [...prev, response])
    } else if (stage === "collecting" || stage === "paused") {
      // Get current question details
      const currentQuestionObj = constructionQuestions.find((q) => q.question === currentQuestion)
      const currentKey = currentQuestionObj?.key as keyof typeof constructionInfo

      if (currentKey) {
        // Check if answer is generic for technical fields
        if (
          currentKey !== "projectName" &&
          currentKey !== "location" &&
          currentKey !== "supervisor" &&
          currentKey !== "date" &&
          isGenericAnswer(userInput)
        ) {
          // Prompt for more detailed information
          const guidanceMessage: Message = {
            id: messages.length + 2,
            content: `请提供更详细的描述，简单回复"正常"或"OK"不符合专业旁站记录的要求。\n\n${fieldGuidance[currentKey] || "请详细描述您观察到的情况，包括检查方法、检查内容和具体结果。"}`,
            sender: "assistant",
            timestamp: new Date(timestamp.getTime() + 1000),
            isGuidance: true,
          }
          setMessages((prev) => [...prev, guidanceMessage])

          // Don't move to next question, wait for a better answer
          setStage("collecting") // Ensure we're in collecting mode
          return
        } else {
          // Save the actual user input
          setConstructionInfo((prev) => ({
            ...prev,
            [currentKey]: userInput,
          }))

          // If this is a technical field, provide positive reinforcement
          if (
            currentKey !== "projectName" &&
            currentKey !== "location" &&
            currentKey !== "supervisor" &&
            currentKey !== "date"
          ) {
            const acknowledgment: Message = {
              id: messages.length + 2,
              content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
              sender: "assistant",
              timestamp: new Date(timestamp.getTime() + 1000),
            }
            setMessages((prev) => [...prev, acknowledgment])
          }
        }
      }

      // Ask next question or generate document
      setTimeout(() => {
        askNextQuestion(timestamp)
      }, 800)
    }
  }

  const getFieldName = (field: keyof typeof constructionInfo | null): string => {
    if (!field) return "上一个问题"

    const fieldNames: Record<string, string> = {
      projectName: "工程项目名称",
      location: "工程地点",
      supervisor: "现场监理人员",
      date: "旁站日期",
      concreteQuality: "混凝土质量情况",
      reinforcementPlacement: "钢筋布置情况",
      formworkCondition: "模板状况",
      safetyMeasures: "安全措施落实情况",
      qualityIssues: "质量问题及处理方法",
    }

    return fieldNames[field] || "上一个问题"
  }

  const askNextQuestion = (timestamp: Date) => {
    // Find which questions have been answered
    const answeredKeys = Object.entries(constructionInfo)
      .filter(([_, value]) => value !== "")
      .map(([key]) => key)

    // Find next question
    const nextQuestion = constructionQuestions.find((q) => !answeredKeys.includes(q.key))

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion.question)
      setCurrentField(nextQuestion.key as keyof typeof constructionInfo)
      setStage("collecting")

      // For technical fields, provide guidance first
      if (
        nextQuestion.key !== "projectName" &&
        nextQuestion.key !== "location" &&
        nextQuestion.key !== "supervisor" &&
        nextQuestion.key !== "date"
      ) {
        const guidanceMessage: Message = {
          id: messages.length + 2,
          content: `${nextQuestion.question}\n\n【专业指导】${fieldGuidance[nextQuestion.key] || "请详细描述您观察到的情况。"}`,
          sender: "assistant",
          timestamp: new Date(timestamp.getTime() + 1000),
          isGuidance: true,
        }
        setMessages((prev) => [...prev, guidanceMessage])
      } else {
        const response: Message = {
          id: messages.length + 2,
          content: nextQuestion.question,
          sender: "assistant",
          timestamp: new Date(timestamp.getTime() + 1000),
        }
        setMessages((prev) => [...prev, response])
      }

      // Set the conversation to paused after asking a question
      // This simulates the real-world scenario where the user might take time to respond
      setStage("paused")
    } else {
      // All questions answered, generate document
      generateDocument(timestamp)
    }
  }

  const generateDocument = (timestamp: Date) => {
    setStage("completed")

    // First send a processing message
    const processingMessage: Message = {
      id: messages.length + 2,
      content: "正在生成专业旁站记录文档，请稍候...",
      sender: "assistant",
      timestamp: new Date(timestamp.getTime() + 1000),
    }
    setMessages((prev) => [...prev, processingMessage])

    // Then send the document after a delay
    setTimeout(() => {
      const documentMessage: Message = {
        id: messages.length + 3,
        content: "旁站记录文档",
        sender: "assistant",
        timestamp: new Date(timestamp.getTime() + 5000), // 5 seconds later
        isDocument: true,
      }
      setMessages((prev) => [...prev, documentMessage])

      // Follow up message
      const followUpMessage: Message = {
        id: messages.length + 4,
        content: `已为您生成专业的旁站记录文档，包含了您提供的详细信息。这份记录将有助于工程质量控制和您的专业成长。您可以点击查看或下载。如需修改，请告诉我。`,
        sender: "assistant",
        timestamp: new Date(timestamp.getTime() + 6000), // 6 seconds later
      }
      setMessages((prev) => [...prev, followUpMessage])
    }, 1500)
  }

  // Function to add a reminder message
  const addReminder = () => {
    if (stage === "paused") {
      const reminderMessage: Message = {
        id: messages.length + 1,
        content: `您好，我注意到您还没有回答关于${getFieldName(currentField)}的问题。当您有时间时，请提供相关信息，以便我们完成旁站记录。`,
        sender: "assistant",
        timestamp: new Date(),
        isReminder: true,
      }
      setMessages((prev) => [...prev, reminderMessage])
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
  }

  const shouldShowDate = (index: number): boolean => {
    if (index === 0) return true

    const currentDate = messages[index].timestamp
    const prevDate = messages[index - 1].timestamp

    return (
      currentDate.getDate() !== prevDate.getDate() ||
      currentDate.getMonth() !== prevDate.getMonth() ||
      currentDate.getFullYear() !== prevDate.getFullYear()
    )
  }

  const shouldShowTimestamp = (index: number): boolean => {
    if (index === 0) return true

    const currentTime = messages[index].timestamp
    const prevTime = messages[index - 1].timestamp

    // Show timestamp if more than 10 minutes have passed
    return currentTime.getTime() - prevTime.getTime() > 10 * 60 * 1000
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
        <div className="flex-1 text-center font-medium">专业旁站助手</div>
        <div className="w-8"></div> {/* Spacer for alignment */}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#ebebeb]">
        {messages.map((message, index) => (
          <div key={message.id}>
            {shouldShowDate(index) && (
              <div className="flex justify-center my-4">
                <div className="bg-[#cecece] text-[#555] text-xs px-2 py-1 rounded-full">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            )}

            {message.sender === "system" ? (
              <div className="flex justify-center my-4">
                <div className="bg-[#cecece] text-[#555] text-xs px-2 py-1 rounded-full flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {message.content}
                </div>
              </div>
            ) : (
              <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {message.sender === "assistant" && (
                  <Avatar className="h-10 w-10 mr-2">
                    <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col">
                  {shouldShowTimestamp(index) && message.sender !== "system" && (
                    <div className="text-xs text-gray-500 mb-1 px-2">{formatTime(message.timestamp)}</div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-[#95ec69] text-black"
                        : message.isGuidance
                          ? "bg-[#f8f4e3] text-black border-l-4 border-[#f0c14b]"
                          : message.isReminder
                            ? "bg-[#e3f2fd] text-black border-l-4 border-[#2196f3]"
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
                              <strong>混凝土质量情况：</strong> {constructionInfo.concreteQuality}
                            </p>
                            <p>
                              <strong>钢筋布置情况：</strong> {constructionInfo.reinforcementPlacement}
                            </p>
                            <p>
                              <strong>模板状况：</strong> {constructionInfo.formworkCondition}
                            </p>
                            <p>
                              <strong>安全措施落实情况：</strong> {constructionInfo.safetyMeasures}
                            </p>
                            <p>
                              <strong>质量问题及处理：</strong> {constructionInfo.qualityIssues}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : message.isGuidance ? (
                      <div>
                        <div className="flex items-start mb-1">
                          <HelpCircle className="h-4 w-4 text-[#f0c14b] mr-1 mt-0.5" />
                          <span className="font-medium text-[#b7791f]">专业指导</span>
                        </div>
                        <div>{message.content}</div>
                      </div>
                    ) : message.isReminder ? (
                      <div>
                        <div className="flex items-start mb-1">
                          <AlertCircle className="h-4 w-4 text-[#2196f3] mr-1 mt-0.5" />
                          <span className="font-medium text-[#1976d2]">提醒</span>
                        </div>
                        <div>{message.content}</div>
                      </div>
                    ) : (
                      <div>{message.content}</div>
                    )}

                    {!shouldShowTimestamp(index) && message.sender !== "system" && (
                      <div className="text-xs text-gray-500 mt-1">{formatTime(message.timestamp)}</div>
                    )}
                  </div>
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
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Demo Controls */}
      <div className="bg-[#f0f0f0] p-2 border-t border-gray-200">
        <div className="flex justify-center space-x-2 text-xs">
          <Button variant="outline" size="sm" onClick={() => simulateTimeJump(1)} className="text-xs h-7">
            +1小时
          </Button>
          <Button variant="outline" size="sm" onClick={() => simulateTimeJump(2)} className="text-xs h-7">
            +2小时
          </Button>
          <Button variant="outline" size="sm" onClick={addReminder} className="text-xs h-7">
            添加提醒
          </Button>
        </div>
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
