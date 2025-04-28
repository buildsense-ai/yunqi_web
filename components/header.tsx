"use client"

import { motion } from "framer-motion"
import { Utensils, Store } from "lucide-react"
import { usePathname } from "next/navigation"

interface HeaderProps {
  eatenCount: number
  notEatenCount: number
  visitedLabel?: string
  notVisitedLabel?: string
}

export default function Header({
  eatenCount,
  notEatenCount,
  visitedLabel = "已吃",
  notVisitedLabel = "未吃",
}: HeaderProps) {
  const pathname = usePathname()
  const isRestaurantPage = pathname.includes("restaurants")

  return (
    <motion.div
      className="text-center py-6"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center items-center mb-6">
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
        >
          {isRestaurantPage ? (
            <Store className="h-10 w-10 text-blue-500 mr-2" />
          ) : (
            <Utensils className="h-10 w-10 text-orange-500 mr-2" />
          )}
        </motion.div>
        <h1
          className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${
            isRestaurantPage ? "from-blue-500 to-purple-500" : "from-orange-500 to-pink-500"
          } text-transparent bg-clip-text`}
        >
          {isRestaurantPage ? "pilibebe的广州餐厅探索" : "pilibebe的广州美食探索"}
        </h1>
      </div>

      <div className="flex justify-center gap-4">
        <motion.div
          className={`${
            isRestaurantPage ? "bg-blue-100 border-blue-300" : "bg-green-100 border-green-300"
          } px-4 py-2 rounded-full border-2`}
          whileHover={{ scale: 1.05 }}
        >
          <span className={`font-bold ${isRestaurantPage ? "text-blue-600" : "text-green-600"}`}>
            {visitedLabel}: {eatenCount}
          </span>
        </motion.div>

        <motion.div
          className={`${
            isRestaurantPage ? "bg-amber-100 border-amber-300" : "bg-orange-100 border-orange-300"
          } px-4 py-2 rounded-full border-2`}
          whileHover={{ scale: 1.05 }}
        >
          <span className={`font-bold ${isRestaurantPage ? "text-amber-600" : "text-orange-600"}`}>
            {notVisitedLabel}: {notEatenCount}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
