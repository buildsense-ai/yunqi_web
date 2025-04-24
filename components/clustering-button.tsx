"use client"

import type React from "react"

import { useState } from "react"
import axios from "axios"

interface ClusteringButtonProps {
  children?: React.ReactNode
}

const ClusteringButton: React.FC<ClusteringButtonProps> = ({ children }) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const generateEvents = async () => {
    try {
      setStatus("loading")
      await axios.post("/api/generate-events")
      setStatus("success")

      // Show toast notification if the function exists
      if (typeof window !== "undefined" && window.showToast) {
        window.showToast("Messages clustered successfully", "success")
      }

      // Reset to idle after showing success for 2 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Error generating events:", error)
      setStatus("error")

      // Show error toast if the function exists
      if (typeof window !== "undefined" && window.showToast) {
        window.showToast("Failed to cluster messages", "error")
      }

      // Reset to idle after showing error for 2 seconds
      setTimeout(() => {
        setStatus("idle")
      }, 2000)
    }
  }

  return (
    <button
      onClick={generateEvents}
      disabled={status === "loading"}
      className={`px-4 py-2 rounded-md ${
        status === "loading" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"
      }`}
    >
      {status === "loading" ? "Clustering..." : children || "Cluster Messages"}
    </button>
  )
}

export default ClusteringButton
