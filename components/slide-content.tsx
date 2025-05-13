"use client"

import { motion } from "framer-motion"
import {
  Database,
  Brain,
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  Bot,
  Network,
  Server,
  Cpu,
  Clock3,
  Search,
  FileQuestion,
  FileCheck,
  Phone,
  MessageSquare,
  BookOpen,
  ClipboardCheck,
} from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import ChatBubble from "./chat-bubble"
import FlowChart from "./flow-chart"

// 动态导入GraphVisualization组件，避免SSR问题
const GraphVisualization = dynamic(() => import("./graph-visualization"), { ssr: false })

interface SlideContentProps {
  slide: {
    id: number
    title: string
    subtitle?: string
    content?: string
    definition?: string
    description?: string
    keyPoints?: string[]
    purposes?: string[]
    image?: string
    bullets?: string[]
    aiImportance?: {
      intro: string
      points: string[]
    }
    technologies?: {
      name: string
      description: string
      role: string
      icon: string
      color: string
    }[]
    graphData?: {
      nodes: {
        id: string
        label: string
        group: string
      }[]
      edges: {
        from: string
        to: string
        label: string
      }[]
    }
    features?: {
      title: string
      description: string
      icon: string
    }[]
    chatMessages?: {
      isUser: boolean
      name: string
      content: string
      avatar?: string
      timestamp?: string
    }[]
    flowSteps?: {
      id: string
      title: string
      description: string
      icon: string
      color: string
    }[]
    comparisonData?: {
      title: string
      traditional: {
        title: string
        points: string[]
      }
      aiAssisted: {
        title: string
        points: string[]
      }
    }
    caseStudy?: {
      problem: string
      description: string
      traditional: {
        title: string
        steps: {
          icon: string
          title: string
          description: string
          time?: string
        }[]
        totalTime: string
        outcome: string
      }
      aiAssisted: {
        title: string
        steps: {
          icon: string
          title: string
          description: string
          time?: string
        }[]
        totalTime: string
        outcome: string
      }
    }
    type:
      | "cover"
      | "content"
      | "definition"
      | "definition-with-image"
      | "definition-and-purpose"
      | "bullets"
      | "content-with-bullets"
      | "features"
      | "ai-and-features"
      | "tech-stack"
      | "graph-visualization"
      | "chat-simulation"
      | "flow-chart"
      | "comparison"
      | "case-comparison"
      | "end"
  }
}

// 动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "database":
      return <Database className="h-8 w-8 text-accent-500" />
    case "brain":
      return <Brain className="h-8 w-8 text-accent-500" />
    case "file-text":
      return <FileText className="h-8 w-8 text-accent-500" />
    case "bot":
      return <Bot className="h-8 w-8 text-white" />
    case "network":
      return <Network className="h-8 w-8 text-white" />
    case "server":
      return <Server className="h-8 w-8 text-white" />
    case "cpu":
      return <Cpu className="h-8 w-8 text-accent-500" />
    case "clock":
      return <Clock className="h-6 w-6" />
    case "search":
      return <Search className="h-6 w-6" />
    case "file-question":
      return <FileQuestion className="h-6 w-6" />
    case "file-check":
      return <FileCheck className="h-6 w-6" />
    case "phone":
      return <Phone className="h-6 w-6" />
    case "message-square":
      return <MessageSquare className="h-6 w-6" />
    case "book-open":
      return <BookOpen className="h-6 w-6" />
    case "clipboard-check":
      return <ClipboardCheck className="h-6 w-6" />
    default:
      return null
  }
}

const getKeyPointIcon = (index: number) => {
  const icons = [
    <CheckCircle key="check" className="h-6 w-6 text-primary-600" />,
    <AlertTriangle key="alert" className="h-6 w-6 text-accent-500" />,
    <Clock key="clock" className="h-6 w-6 text-primary-600" />,
    <Shield key="shield" className="h-6 w-6 text-accent-500" />,
    <Users key="users" className="h-6 w-6 text-primary-600" />,
  ]
  return icons[index % icons.length]
}

export default function SlideContent({ slide }: SlideContentProps) {
  // 根据幻灯片类型渲染不同的内容
  switch (slide.type) {
    case "case-comparison":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          {slide.caseStudy && (
            <>
              <motion.div className="mb-4" variants={itemVariants}>
                <h3 className="text-lg font-semibold text-primary-700 mb-1">{slide.caseStudy.problem}</h3>
                <p className="text-sm text-secondary-700">{slide.caseStudy.description}</p>
              </motion.div>

              <motion.div
                className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar"
                variants={itemVariants}
              >
                {/* 传统旁站流程 */}
                <motion.div
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary-200 flex flex-col"
                  variants={itemVariants}
                >
                  <div className="bg-secondary-700 p-4">
                    <h3 className="text-lg font-semibold text-white">{slide.caseStudy.traditional.title}</h3>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      {slide.caseStudy.traditional.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start bg-secondary-50 p-3 rounded-lg border-l-2 border-secondary-300"
                          variants={itemVariants}
                          custom={index}
                        >
                          <div className="mr-3 p-2 bg-secondary-200 rounded-full text-secondary-700">
                            {getIcon(step.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-secondary-800">{step.title}</h4>
                              {step.time && (
                                <span className="text-xs bg-secondary-200 text-secondary-700 px-2 py-1 rounded-full flex items-center">
                                  <Clock3 className="h-3 w-3 mr-1" />
                                  {step.time}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-secondary-600">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-secondary-100 p-3 border-t border-secondary-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock3 className="h-4 w-4 text-secondary-700 mr-2" />
                        <span className="text-sm font-medium text-secondary-800">
                          总耗时: {slide.caseStudy.traditional.totalTime}
                        </span>
                      </div>
                      <div className="text-sm text-secondary-800">
                        <span className="font-medium">结果: </span>
                        {slide.caseStudy.traditional.outcome}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI辅助旁站流程 */}
                <motion.div
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-primary-200 flex flex-col"
                  variants={itemVariants}
                >
                  <div className="bg-primary-600 p-4">
                    <h3 className="text-lg font-semibold text-white">{slide.caseStudy.aiAssisted.title}</h3>
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      {slide.caseStudy.aiAssisted.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start bg-primary-50 p-3 rounded-lg border-l-2 border-primary-300"
                          variants={itemVariants}
                          custom={index}
                        >
                          <div className="mr-3 p-2 bg-primary-200 rounded-full text-primary-700">
                            {getIcon(step.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-primary-800">{step.title}</h4>
                              {step.time && (
                                <span className="text-xs bg-primary-200 text-primary-700 px-2 py-1 rounded-full flex items-center">
                                  <Clock3 className="h-3 w-3 mr-1" />
                                  {step.time}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-primary-600">{step.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-primary-100 p-3 border-t border-primary-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock3 className="h-4 w-4 text-primary-700 mr-2" />
                        <span className="text-sm font-medium text-primary-800">
                          总耗时: {slide.caseStudy.aiAssisted.totalTime}
                        </span>
                      </div>
                      <div className="text-sm text-primary-800">
                        <span className="font-medium">结果: </span>
                        {slide.caseStudy.aiAssisted.outcome}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </motion.div>
      )

    case "flow-chart":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          {slide.description && (
            <motion.p className="text-sm text-secondary-700 mb-6" variants={itemVariants}>
              {slide.description}
            </motion.p>
          )}

          <motion.div className="flex-1 overflow-y-auto custom-scrollbar" variants={itemVariants}>
            {slide.flowSteps && <FlowChart steps={slide.flowSteps} />}
          </motion.div>
        </motion.div>
      )

    case "comparison":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          {slide.description && (
            <motion.p className="text-sm text-secondary-700 mb-6" variants={itemVariants}>
              {slide.description}
            </motion.p>
          )}

          {slide.comparisonData && (
            <motion.div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
              {/* 传统旁站流程 */}
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary-200"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-secondary-700 p-4">
                  <h3 className="text-lg font-semibold text-white">{slide.comparisonData.traditional.title}</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {slide.comparisonData.traditional.points.map((point, index) => (
                      <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                        <div className="mr-2 mt-1 h-3 w-3 rounded-full bg-secondary-500 flex-shrink-0"></div>
                        <p className="text-sm text-secondary-700">{point}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* AI辅助旁站流程 */}
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden border border-primary-200"
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="bg-primary-600 p-4">
                  <h3 className="text-lg font-semibold text-white">{slide.comparisonData.aiAssisted.title}</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {slide.comparisonData.aiAssisted.points.map((point, index) => (
                      <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                        <div className="mr-2 mt-1 h-3 w-3 rounded-full bg-accent-500 flex-shrink-0"></div>
                        <p className="text-sm text-secondary-700">{point}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )

    case "chat-simulation":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          {slide.description && (
            <motion.p className="text-sm text-secondary-700 mb-4" variants={itemVariants}>
              {slide.description}
            </motion.p>
          )}

          <motion.div
            className="flex-1 bg-secondary-50 rounded-lg p-4 overflow-y-auto custom-scrollbar"
            variants={itemVariants}
          >
            <div className="flex flex-col items-center">
              {slide.chatMessages?.map((message, index) => (
                <ChatBubble
                  key={index}
                  isUser={message.isUser}
                  name={message.name}
                  avatar={message.avatar}
                  timestamp={message.timestamp}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                </ChatBubble>
              ))}
            </div>
          </motion.div>

          <motion.div className="mt-4 text-xs text-secondary-500 text-center" variants={itemVariants}>
            <p>旁站AI助手基于公司自建图数据库提供专业指导，通过Coze平台发送HTTP请求至FastAPI后端获取分析结果</p>
          </motion.div>
        </motion.div>
      )

    case "cover":
      return (
        <motion.div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary-800 to-primary-950 p-8 text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-accent-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h1 className="mb-6 text-center text-4xl font-bold md:text-5xl lg:text-6xl" variants={itemVariants}>
            {slide.title}
          </motion.h1>
          {slide.subtitle && (
            <motion.p className="text-center text-xl text-primary-100 md:text-2xl" variants={itemVariants}>
              {slide.subtitle}
            </motion.p>
          )}
          <motion.div className="mt-12 flex items-center justify-center" variants={itemVariants}>
            <div className="h-1 w-16 rounded-full bg-accent-500"></div>
          </motion.div>
        </motion.div>
      )

    case "tech-stack":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          {slide.subtitle && (
            <motion.p className="text-base text-secondary-600 mb-4" variants={itemVariants}>
              {slide.subtitle}
            </motion.p>
          )}

          <motion.div
            className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
            variants={itemVariants}
            style={{ maxHeight: "calc(100% - 100px)" }}
          >
            <div className="grid grid-cols-1 gap-4">
              {slide.technologies?.map((tech, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  variants={itemVariants}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <div className="flex">
                    <div className={`w-16 flex items-center justify-center p-4 ${tech.color}`}>
                      {getIcon(tech.icon)}
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="text-lg font-semibold text-primary-700 mb-1">{tech.name}</h3>
                      <p className="text-xs text-secondary-600 mb-2">{tech.description}</p>
                      <div className="bg-secondary-50 p-2 rounded-md">
                        <p className="text-xs text-secondary-700">
                          <span className="font-semibold">在本项目中的作用：</span> {tech.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )

    case "graph-visualization":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          {slide.description && (
            <motion.p className="text-sm text-secondary-700 mb-4" variants={itemVariants}>
              {slide.description}
            </motion.p>
          )}

          <motion.div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-hidden" variants={itemVariants}>
            {slide.graphData && <GraphVisualization graphData={slide.graphData} />}
          </motion.div>

          <motion.div className="mt-4 grid grid-cols-4 gap-2" variants={itemVariants}>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4f46e5] mr-2"></div>
              <span className="text-xs">施工现场</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#10b981] mr-2"></div>
              <span className="text-xs">法规条例</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#f97316] mr-2"></div>
              <span className="text-xs">施工工序</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-2"></div>
              <span className="text-xs">潜在风险</span>
            </div>
          </motion.div>
        </motion.div>
      )

    case "definition-and-purpose":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* 左侧：定义和关键点 */}
            <motion.div className="flex flex-col" variants={itemVariants}>
              {slide.definition && (
                <div className="mb-4 p-4 bg-primary-50 rounded-xl border-l-4 border-primary-500 shadow-md">
                  <p className="text-base text-secondary-700 leading-relaxed">{slide.definition}</p>
                </div>
              )}

              {slide.keyPoints && (
                <div className="mt-2">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">关键特点：</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {slide.keyPoints.map((point, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center bg-white p-2 rounded-lg shadow-sm border border-secondary-100 hover:shadow-md transition-shadow duration-300"
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      >
                        <div className="mr-2 flex-shrink-0">{getKeyPointIcon(index)}</div>
                        <p className="text-sm text-secondary-700">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* 右侧：核心目的和图片 */}
            <motion.div className="flex flex-col" variants={itemVariants}>
              {slide.purposes && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">核心目的：</h3>
                  <ul className="space-y-2">
                    {slide.purposes.map((purpose, index) => (
                      <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                        <div className="mr-2 mt-1 h-3 w-3 rounded-full bg-accent-500 flex-shrink-0"></div>
                        <p className="text-sm text-secondary-700">{purpose}</p>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {slide.image && (
                <motion.div
                  className="mt-auto flex-shrink-0 flex items-center justify-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                >
                  <div className="relative w-full h-40 overflow-hidden rounded-xl shadow-lg border-2 border-white">
                    <Image src={slide.image || "/placeholder.svg"} alt="旁站监理示意图" fill className="object-cover" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )

    case "ai-and-features":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-4 border-b border-secondary-200 pb-3 text-2xl font-bold text-primary-800 md:text-3xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* 左侧：AI重要性 */}
            <motion.div className="flex flex-col" variants={itemVariants}>
              {slide.aiImportance && (
                <>
                  <h3 className="text-lg font-semibold text-primary-700 mb-2">AI赋能的重要性：</h3>
                  <p className="text-sm text-secondary-700 mb-3">{slide.aiImportance.intro}</p>
                  <ul className="space-y-2">
                    {slide.aiImportance.points.map((point, index) => (
                      <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                        <div className="mr-2 mt-1 h-3 w-3 rounded-full bg-accent-500 flex-shrink-0"></div>
                        <p className="text-sm text-secondary-700">{point}</p>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>

            {/* 右侧：核心功能 */}
            <motion.div className="flex flex-col" variants={itemVariants}>
              <h3 className="text-lg font-semibold text-primary-700 mb-2">核心功能与优势：</h3>
              <div className="space-y-3">
                {slide.features &&
                  slide.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex bg-white p-3 rounded-lg shadow-sm border-l-3 border-accent-500 hover:shadow-md transition-shadow duration-300"
                      variants={itemVariants}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    >
                      <div className="mr-3 flex-shrink-0">{getIcon(feature.icon)}</div>
                      <div>
                        <h4 className="text-base font-semibold text-primary-700 mb-1">{feature.title}</h4>
                        <p className="text-xs text-secondary-600">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )

    case "definition-with-image":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-8 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>

          <div className="flex flex-1 gap-8">
            <motion.div className="flex-1" variants={itemVariants}>
              {slide.definition && (
                <div className="mb-8 p-6 bg-primary-50 rounded-xl border-l-4 border-primary-500 shadow-md">
                  <p className="text-lg text-secondary-700 leading-relaxed">{slide.definition}</p>
                </div>
              )}

              {slide.keyPoints && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-primary-700 mb-4">关键特点：</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {slide.keyPoints.map((point, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-secondary-100 hover:shadow-md transition-shadow duration-300"
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      >
                        <div className="mr-3 flex-shrink-0">{getKeyPointIcon(index)}</div>
                        <p className="text-secondary-700">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {slide.image && (
              <motion.div
                className="w-1/3 flex-shrink-0 flex items-center justify-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <div className="relative w-full h-64 overflow-hidden rounded-xl shadow-lg border-4 border-white">
                  <Image src={slide.image || "/placeholder.svg"} alt="旁站监理示意图" fill className="object-cover" />
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )

    case "definition":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-8 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          <motion.div className="flex-1 flex items-center justify-center" variants={itemVariants}>
            {slide.content && (
              <div className="max-w-3xl p-8 bg-primary-50 rounded-xl border-l-4 border-primary-500 shadow-lg">
                <p className="text-xl text-secondary-700 leading-relaxed">{slide.content}</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )

    case "bullets":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-8 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          <motion.div className="flex-1" variants={itemVariants}>
            {slide.bullets && (
              <ul className="space-y-4 mt-6">
                {slide.bullets.map((bullet, index) => (
                  <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                    <div className="mr-4 mt-1 h-4 w-4 rounded-full bg-accent-500 flex-shrink-0"></div>
                    <p className="text-xl text-secondary-700">{bullet}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )

    case "content-with-bullets":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-6 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          {slide.content && (
            <motion.p className="text-lg text-secondary-700 mb-8" variants={itemVariants}>
              {slide.content}
            </motion.p>
          )}
          <motion.div className="flex-1" variants={itemVariants}>
            {slide.bullets && (
              <ul className="space-y-4">
                {slide.bullets.map((bullet, index) => (
                  <motion.li key={index} className="flex items-start" variants={itemVariants} custom={index}>
                    <div className="mr-4 mt-1 h-4 w-4 rounded-full bg-accent-500 flex-shrink-0"></div>
                    <p className="text-lg text-secondary-700">{bullet}</p>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )

    case "features":
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-8 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          <motion.div className="flex-1 grid grid-cols-1 gap-8 mt-4" variants={itemVariants}>
            {slide.features &&
              slide.features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex bg-white p-6 rounded-xl shadow-md border-l-4 border-accent-500 hover:shadow-lg transition-shadow duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="mr-6 flex-shrink-0">{getIcon(feature.icon)}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-primary-700 mb-2">{feature.title}</h3>
                    <p className="text-secondary-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </motion.div>
      )

    case "end":
      return (
        <motion.div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary-800 to-primary-950 p-8 text-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-2 bg-accent-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h1 className="mb-6 text-center text-4xl font-bold md:text-5xl lg:text-6xl" variants={itemVariants}>
            {slide.title}
          </motion.h1>
          {slide.subtitle && (
            <motion.p className="text-center text-xl text-primary-100 md:text-2xl" variants={itemVariants}>
              {slide.subtitle}
            </motion.p>
          )}
          <motion.div className="mt-12 flex items-center justify-center" variants={itemVariants}>
            <div className="h-1 w-16 rounded-full bg-accent-500"></div>
          </motion.div>
        </motion.div>
      )

    case "content":
    default:
      return (
        <motion.div
          className="flex h-full w-full flex-col p-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-primary-500"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
          <motion.h2
            className="mb-8 border-b border-secondary-200 pb-4 text-3xl font-bold text-primary-800 md:text-4xl"
            variants={itemVariants}
          >
            {slide.title}
          </motion.h2>
          <motion.div className="flex-1" variants={itemVariants}>
            {slide.content && <p className="text-lg text-secondary-700">{slide.content}</p>}
          </motion.div>
        </motion.div>
      )
  }
}
