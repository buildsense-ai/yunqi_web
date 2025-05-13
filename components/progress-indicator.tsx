"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  currentSlide: number
  totalSlides: number
}

export default function ProgressIndicator({ currentSlide, totalSlides }: ProgressIndicatorProps) {
  const progress = (currentSlide + 1) / totalSlides

  return (
    <div className="absolute top-0 left-0 w-full h-1 bg-secondary-200 z-10">
      <motion.div
        className="h-full bg-accent-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}
