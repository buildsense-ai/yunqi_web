"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard } from "lucide-react"
import Link from "next/link"

export default function ViewCardsButton() {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <Link href="/cards">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="查看卡片"
        >
          <CreditCard size={16} />
        </motion.button>
      </Link>

      {showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          查看卡片
        </div>
      )}
    </div>
  )
}
