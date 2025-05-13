"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SlideProps {
  children: ReactNode
}

export default function Slide({ children }: SlideProps) {
  return (
    <motion.div
      className="relative h-[80vh] w-[90vw] max-w-6xl overflow-hidden rounded-xl bg-white shadow-2xl md:h-[85vh] md:w-[85vw]"
      initial={{ boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      whileHover={{ boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)" }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
