"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Check, X, Calendar, Cloud, MapPin } from "lucide-react"
import MealForm, { type MealData } from "./meal-form"
import type { FoodItem } from "@/types"

interface FoodCardProps {
  food: FoodItem
  onToggle: (id: string, mealData?: MealData) => void
}

export default function FoodCard({ food, onToggle }: FoodCardProps) {
  const [showForm, setShowForm] = useState(false)

  const handleFormSubmit = (mealData: MealData) => {
    onToggle(food.id, mealData)
    setShowForm(false)
  }

  const handleButtonClick = () => {
    if (food.eaten) {
      // 如果已经吃过，直接切换回未吃状态
      onToggle(food.id)
    } else {
      // 如果未吃，显示表单
      setShowForm(true)
    }
  }

  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative ${
        food.eaten
          ? "bg-gradient-to-br from-green-100 to-green-200 border-2 border-green-300"
          : "bg-gradient-to-br from-orange-100 to-pink-100 border-2 border-orange-200"
      }`}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <AnimatePresence>
        {showForm && <MealForm onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}
      </AnimatePresence>

      <div className="relative h-48 w-full">
        <Image src={food.image || "/placeholder.svg"} alt={food.name} fill className="object-cover" />
        <div className={`absolute top-2 right-2 rounded-full p-1 ${food.eaten ? "bg-green-500" : "bg-orange-500"}`}>
          {food.eaten ? <Check className="h-5 w-5 text-white" /> : <X className="h-5 w-5 text-white" />}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{food.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-700">{food.category}</span>
        </div>

        {food.eaten && food.mealData && (
          <div className="mb-3 text-xs space-y-1">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{food.mealData.date}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Cloud className="h-3 w-3" />
              <span>{food.mealData.weather}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{food.mealData.location}</span>
            </div>
          </div>
        )}

        <motion.button
          className={`w-full py-2 mt-2 rounded-lg font-medium text-white transition-colors ${
            food.eaten ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"
          }`}
          onClick={handleButtonClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {food.eaten ? "已吃过 🎉" : "还没吃 🍽️"}
        </motion.button>
      </div>
    </motion.div>
  )
}
