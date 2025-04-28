"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Check, X, Calendar, Cloud, MapPin } from "lucide-react"
import MealForm, { type MealData } from "./meal-form"
import type { RestaurantItem } from "@/types"

interface RestaurantCardProps {
  restaurant: RestaurantItem
  onToggle: (id: string, visitData?: MealData) => void
}

export default function RestaurantCard({ restaurant, onToggle }: RestaurantCardProps) {
  const [showForm, setShowForm] = useState(false)

  const handleFormSubmit = (visitData: MealData) => {
    onToggle(restaurant.id, visitData)
    setShowForm(false)
  }

  const handleButtonClick = () => {
    if (restaurant.visited) {
      // 如果已经去过，直接切换回未去状态
      onToggle(restaurant.id)
    } else {
      // 如果未去，显示表单
      setShowForm(true)
    }
  }

  return (
    <motion.div
      className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 relative ${
        restaurant.visited
          ? "bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300"
          : "bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-200"
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
        <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        <div
          className={`absolute top-2 right-2 rounded-full p-1 ${restaurant.visited ? "bg-blue-500" : "bg-amber-500"}`}
        >
          {restaurant.visited ? <Check className="h-5 w-5 text-white" /> : <X className="h-5 w-5 text-white" />}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{restaurant.name}</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-700">{restaurant.category}</span>
        </div>

        {restaurant.visited && restaurant.visitData && (
          <div className="mb-3 text-xs space-y-1">
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>{restaurant.visitData.date}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Cloud className="h-3 w-3" />
              <span>{restaurant.visitData.weather}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{restaurant.visitData.location}</span>
            </div>
          </div>
        )}

        <motion.button
          className={`w-full py-2 mt-2 rounded-lg font-medium text-white transition-colors ${
            restaurant.visited ? "bg-blue-500 hover:bg-blue-600" : "bg-amber-500 hover:bg-amber-600"
          }`}
          onClick={handleButtonClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {restaurant.visited ? "已去过 🎉" : "还没去 🍴"}
        </motion.button>
      </div>
    </motion.div>
  )
}
