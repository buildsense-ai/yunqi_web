"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Paperclip, Send, User, HelpCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: number
  content: string
  sender: "user" | "assistant" | "system"
  timestamp: string
  isDocument?: boolean
  isGuidance?: boolean
  isReminder?: boolean
  userName?: string
}

export default function ConstructionChat() {
  const [showDocPreview, setShowDocPreview] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Predefined conversation based on the provided example
  const [messages] = useState<Message[]>([
    {
      id: 1,
      content: "您好！我是您的专业旁站记录助手，可以帮助您完成规范的旁站记录。请问有什么可以帮您的吗？",
      sender: "assistant",
      timestamp: "09:15",
    },
    {
      id: 2,
      content: "我今天负责3号楼基础施工旁站，需要做记录",
      sender: "user",
      timestamp: "10:32",
      userName: "小李（实习生）",
    },
    {
      id: 3,
      content:
        "我将帮助您完成专业的旁站记录。作为实习生，详细记录现场情况对您的专业成长非常重要。我会引导您一步步完成规范的旁站记录。",
      sender: "assistant",
      timestamp: "10:32",
    },
    {
      id: 4,
      content: "请问工程项目名称是什么？",
      sender: "assistant",
      timestamp: "10:32",
    },
    {
      id: 5,
      content: "滨江花园三期工程",
      sender: "user",
      timestamp: "10:35",
      userName: "小李（实习生）",
    },
    {
      id: 6,
      content: "请问工程地点在哪里？",
      sender: "assistant",
      timestamp: "10:35",
    },
    {
      id: 7,
      content: "杭州市滨江区江南大道与滨兴路交叉口东北角",
      sender: "user",
      timestamp: "11:20",
      userName: "小李（实习生）",
    },
    {
      id: 8,
      content: "请问现场监理人员是谁？",
      sender: "assistant",
      timestamp: "11:20",
    },
    {
      id: 9,
      content: "张工和我小李",
      sender: "user",
      timestamp: "11:22",
      userName: "小李（实习生）",
    },
    {
      id: 10,
      content: "请问旁站日期是什么时候？",
      sender: "assistant",
      timestamp: "11:22",
    },
    {
      id: 11,
      content: "今天5月8日",
      sender: "user",
      timestamp: "11:23",
      userName: "小李（实习生）",
    },
    {
      id: 12,
      content:
        "请详细描述混凝土的质量情况（包括坍落度、强度等级、浇筑过程等）：\n\n【专业指导】检查混凝土的坍落度、强度等级、配合比是否符合设计要求。观察混凝土运输、浇筑过程是否规范，有无离析现象。",
      sender: "assistant",
      timestamp: "11:23",
      isGuidance: true,
    },
    {
      id: 13,
      content: "2小时后...",
      sender: "system",
      timestamp: "",
    },
    {
      id: 14,
      content:
        "您好，我注意到您还没有回答关于混凝土质量情况的问题。当您有时间时，请提供相关信息，以便我们完成旁站记录。",
      sender: "assistant",
      timestamp: "13:23",
      isReminder: true,
    },
    {
      id: 15,
      content:
        "抱歉刚才在现场忙，混凝土是C30，坍落度测试结果为18cm，符合要求。搅拌站出厂到现场时间约30分钟，浇筑时分层振捣，每层厚度控制在50cm以内。未发现离析现象。",
      sender: "user",
      timestamp: "14:05",
      userName: "小李（实习生）",
    },
    {
      id: 16,
      content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
      sender: "assistant",
      timestamp: "14:05",
    },
    {
      id: 17,
      content:
        "请详细描述钢筋布置情况（包括规格、间距、保护层厚度等）：\n\n【专业指导】检查钢筋的规格、间距、保护层厚度是否符合设计图纸要求。观察钢筋的连接方式、搭接长度是否符合规范。",
      sender: "assistant",
      timestamp: "14:05",
      isGuidance: true,
    },
    {
      id: 18,
      content: "1小时后...",
      sender: "system",
      timestamp: "",
    },
    {
      id: 19,
      content:
        "基础底板主筋为HRB400级Φ20@200，箍筋为HPB300级Φ8@150。钢筋间距经抽查符合设计要求，误差在±10mm以内。保护层采用5cm混凝土垫块控制，实测保护层厚度符合规范要求。钢筋连接采用绑扎搭接，搭接长度不小于35d。",
      sender: "user",
      timestamp: "15:10",
      userName: "小李（实习生）",
    },
    {
      id: 20,
      content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
      sender: "assistant",
      timestamp: "15:10",
    },
    {
      id: 21,
      content:
        "请详细描述模板状况（包括支撑系统、表面情况等）：\n\n【专业指导】检查模板的支撑系统是否稳固，模板表面是否平整、清洁。观察模板的刚度、密封性是否良好，有无漏浆现象。",
      sender: "assistant",
      timestamp: "15:10",
      isGuidance: true,
    },
    {
      id: 22,
      content: "2小时后...",
      sender: "system",
      timestamp: "",
    },
    {
      id: 23,
      content: "您好，我注意到您还没有回答关于模板状况的问题。当您有时间时，请提供相关信息，以便我们完成旁站记录。",
      sender: "assistant",
      timestamp: "17:10",
      isReminder: true,
    },
    {
      id: 24,
      content:
        "基础模板采用钢模，支撑系统使用可调钢管支撑，间距600mm。模板表面已清理干净，无杂物。接缝处采用密封胶带处理，未发现明显缝隙。支撑系统加固牢固，水平撑和立杆连接稳定。模板刚度满足要求，未见明显变形。",
      sender: "user",
      timestamp: "17:45",
      userName: "小李（实习生）",
    },
    {
      id: 25,
      content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
      sender: "assistant",
      timestamp: "17:45",
    },
    {
      id: 26,
      content:
        "请详细描述安全措施落实情况（包括临边防护、高处作业防护等）：\n\n【专业指导】检查施工现场的安全防护措施是否到位，如临边防护、高处作业防护、用电安全等。观察工人是否佩戴安全帽等防护装备。",
      sender: "assistant",
      timestamp: "17:45",
      isGuidance: true,
    },
    {
      id: 27,
      content:
        "现场工人均佩戴安全帽，基坑周边设置了1.2m高的防护栏杆，并有明显的警示标志。临时用电设备有漏电保护装置，电线架空敷设。现场配备了灭火器，安全通道畅通。高处作业人员系安全带，脚手架搭设规范，设置了安全网。",
      sender: "user",
      timestamp: "18:30",
      userName: "小李（实习生）",
    },
    {
      id: 28,
      content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
      sender: "assistant",
      timestamp: "18:30",
    },
    {
      id: 29,
      content:
        "请描述发现的质量问题及处理方法（如无问题，请详细说明检查过程和结果）：\n\n【专业指导】记录施工过程中发现的任何质量问题，如混凝土蜂窝麻面、钢筋锈蚀、模板变形等，并注明处理方法。",
      sender: "assistant",
      timestamp: "18:30",
      isGuidance: true,
    },
    {
      id: 30,
      content: "1小时后...",
      sender: "system",
      timestamp: "",
    },
    {
      id: 31,
      content:
        "在检查过程中发现基础西北角有少量钢筋保护层垫块脱落，已要求施工单位立即补充设置垫块。另外，局部模板接缝处有轻微渗漏迹象，已要求加强密封处理。检查了钢筋绑扎、混凝土浇筑准备工作，其余部分符合设计和规范要求。",
      sender: "user",
      timestamp: "19:35",
      userName: "小李（实习生）",
    },
    {
      id: 32,
      content: "感谢您的详细记录，这样的专业描述对旁站记录非常重要。",
      sender: "assistant",
      timestamp: "19:35",
    },
    {
      id: 33,
      content: "正在生成专业旁站记录文档，请稍候...",
      sender: "assistant",
      timestamp: "19:35",
    },
    {
      id: 34,
      content: "旁站记录文档",
      sender: "assistant",
      timestamp: "19:36",
      isDocument: true,
    },
    {
      id: 35,
      content:
        "已为您生成专业的旁站记录文档，包含了您提供的详细信息。这份记录将有助于工程质量控制和您的专业成长。您可以点击查看或下载。如需修改，请告诉我。",
      sender: "assistant",
      timestamp: "19:36",
    },
    {
      id: 36,
      content: "谢谢，这个文档很详细，明天我还要继续旁站，到时候再找你",
      sender: "user",
      timestamp: "19:40",
      userName: "小李（实习生）",
    },
    {
      id: 37,
      content:
        "不客气！您今天的记录非常专业。明天旁站时，建议您特别关注以下几点：\n\n1. 混凝土浇筑过程中的振捣是否充分\n2. 后浇带处理是否规范\n3. 施工缝处理方法是否符合要求\n4. 混凝土养护措施是否到位\n\n期待明天继续协助您完成旁站记录。如有任何问题，随时可以咨询我。祝您工作顺利！",
      sender: "assistant",
      timestamp: "19:40",
    },
  ])

  // Auto scroll to bottom on initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const toggleDocPreview = () => {
    setShowDocPreview(!showDocPreview)
  }

  return (
    <div className="flex flex-col h-[800px] max-w-md mx-auto bg-gray-100 rounded-xl overflow-hidden shadow-lg">
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
        {messages.map((message) => (
          <div key={message.id}>
            {message.sender === "system" ? (
              <div className="flex justify-center my-4">
                <div className="bg-[#cecece] text-[#555] text-xs px-2 py-1 rounded-full">{message.content}</div>
              </div>
            ) : (
              <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                {message.sender === "assistant" && (
                  <Avatar className="h-10 w-10 mr-2 flex-shrink-0">
                    <AvatarImage src="/abstract-ai-network.png" alt="AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col max-w-[70%]">
                  {message.sender === "user" && (
                    <div className="text-xs text-gray-500 mb-1 self-end px-2">{message.userName}</div>
                  )}

                  <div
                    className={`rounded-lg p-3 ${
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
                              <strong>工程名称：</strong> 滨江花园三期工程
                            </p>
                            <p>
                              <strong>工程地点：</strong> 杭州市滨江区江南大道与滨兴路交叉口东北角
                            </p>
                            <p>
                              <strong>监理人员：</strong> 张工和小李
                            </p>
                            <p>
                              <strong>旁站日期：</strong> 2025年5月8日
                            </p>
                            <p>
                              <strong>混凝土质量情况：</strong>{" "}
                              混凝土是C30，坍落度测试结果为18cm，符合要求。搅拌站出厂到现场时间约30分钟，浇筑时分层振捣，每层厚度控制在50cm以内。未发现离析现象。
                            </p>
                            <p>
                              <strong>钢筋布置情况：</strong>{" "}
                              基础底板主筋为HRB400级Φ20@200，箍筋为HPB300级Φ8@150。钢筋间距经抽查符合设计要求，误差在±10mm以内。保护层采用5cm混凝土垫块控制，实测保护层厚度符合规范要求。钢筋连接采用绑扎搭接，搭接长度不小于35d。
                            </p>
                            <p>
                              <strong>模板状况：</strong>{" "}
                              基础模板采用钢模，支撑系统使用可调钢管支撑，间距600mm。模板表面已清理干净，无杂物。接缝处采用密封胶带处理，未发现明显缝隙。支撑系统加固牢固，水平撑和立杆连接稳定。模板刚度满足要求，未见明显变形。
                            </p>
                            <p>
                              <strong>安全措施落实情况：</strong>{" "}
                              现场工人均佩戴安全帽，基坑周边设置了1.2m高的防护栏杆，并有明显的警示标志。临时用电设备有漏电保护装置，电线架空敷设。现场配备了灭火器，安全通道畅通。高处作业人员系安全带，脚手架搭设规范，设置了安全网。
                            </p>
                            <p>
                              <strong>质量问题及处理：</strong>{" "}
                              在检查过程中发现基础西北角有少量钢筋保护层垫块脱落，已要求施工单位立即补充设置垫块。另外，局部模板接缝处有轻微渗漏迹象，已要求加强密封处理。检查了钢筋绑扎、混凝土浇筑准备工作，其余部分符合设计和规范要求。
                            </p>
                          </div>
                        )}
                      </div>
                    ) : message.isGuidance ? (
                      <div>
                        <div className="flex items-start mb-1">
                          <HelpCircle className="h-4 w-4 text-[#f0c14b] mr-1 mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-[#b7791f]">专业指导</span>
                        </div>
                        <div className="whitespace-pre-line">{message.content}</div>
                      </div>
                    ) : message.isReminder ? (
                      <div>
                        <div className="flex items-start mb-1">
                          <AlertCircle className="h-4 w-4 text-[#2196f3] mr-1 mt-0.5 flex-shrink-0" />
                          <span className="font-medium text-[#1976d2]">提醒</span>
                        </div>
                        <div>{message.content}</div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-line">{message.content}</div>
                    )}

                    <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
                  </div>
                </div>

                {message.sender === "user" && (
                  <Avatar className="h-10 w-10 ml-2 flex-shrink-0">
                    <AvatarImage src="/construction-worker-safety.png" alt="User" />
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

      {/* Input - Disabled for demo */}
      <div className="p-3 bg-[#f5f5f5] border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            disabled
            placeholder="此为演示对话，不可输入"
            className="flex-1 bg-white p-2 rounded-md border border-gray-300 text-gray-400"
          />
          <Button disabled size="icon" className="bg-[#07c160] text-white hover:bg-[#06b057] opacity-50">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-center mt-2 text-gray-500">
          这是一个模拟的工地现场对话演示，展示了实习生与专业旁站助手之间的不连续对话
        </div>
      </div>
    </div>
  )
}
