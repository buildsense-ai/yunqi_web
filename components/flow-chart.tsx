"use client"

import { motion } from "framer-motion"
import { MessageSquare, Database, FileText, BrainCircuit, CheckCircle } from "lucide-react"

interface FlowChartProps {
  steps: {
    id: string
    title: string
    description: string
    icon: string
    color: string
  }[]
}

export default function FlowChart({ steps }: FlowChartProps) {
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
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
      case "message-square":
        return <MessageSquare className="h-8 w-8" />
      case "database":
        return <Database className="h-8 w-8" />
      case "file-text":
        return <FileText className="h-8 w-8" />
      case "brain-circuit":
        return <BrainCircuit className="h-8 w-8" />
      case "check-circle":
        return <CheckCircle className="h-8 w-8" />
      default:
        return <MessageSquare className="h-8 w-8" />
    }
  }

  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-4xl">
        <div className="relative">
          {steps.map((step, index) => (
            <motion.div key={step.id} className="flex mb-8 relative" variants={itemVariants}>
              {/* 连接线 */}
              {index < steps.length - 1 && (
                <motion.div
                  className="absolute left-8 top-16 h-16 w-0.5 bg-secondary-200"
                  initial={{ scaleY: 0, originY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                />
              )}

              {/* 步骤图标 */}
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-full ${step.color} flex items-center justify-center text-white shadow-lg`}
              >
                {getIcon(step.icon)}
              </div>

              {/* 步骤内容 */}
              <div className="ml-6 flex-1">
                <h3 className="text-xl font-bold text-primary-700 mb-2">{step.title}</h3>
                <p className="text-secondary-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
