"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

interface ClusteringButtonProps {
  onClusteringComplete?: () => void
}

export default function ClusteringButton({ onClusteringComplete }: ClusteringButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleCluster = async () => {
    try {
      setIsLoading(true)
      // Call the clustering API endpoint with GET method
      await axios.get("/api/generate-events")
      // Show success state briefly
      setTimeout(() => {
        setIsLoading(false)
        if (onClusteringComplete) {
          onClusteringComplete()
        }
      }, 1000)
    } catch (error) {
      console.error("Error clustering messages:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleCluster}
        disabled={isLoading}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Auto-cluster messages"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Sparkles size={16} />
        )}
      </motion.button>

      {showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          Auto-cluster messages
        </div>
      )}
    </div>
  )
}
