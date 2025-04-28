"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import RestaurantCard from "@/components/restaurant-card"
import Header from "@/components/header"
import type { RestaurantItem } from "@/types"
import type { MealData } from "@/components/meal-form"

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantItem[]>([
    {
      id: "1",
      name: "广州炳记餐厅",
      category: "粤菜",
      visited: false,
      image: "/restaurant-guangzhou.png",
    },
    {
      id: "2",
      name: "八合里牛肉火锅",
      category: "火锅",
      visited: false,
      image: "/restaurant-hotpot.png",
    },
    {
      id: "3",
      name: "麦当劳",
      category: "快餐",
      visited: false,
      image: "/restaurant-mcdonalds.png",
    },
    {
      id: "4",
      name: "巴西拉丁餐厅",
      category: "异国料理",
      visited: false,
      image: "/restaurant-brazilian.png",
    },
  ])

  // 切换餐厅的去过/没去状态
  const toggleVisited = (id: string, visitData?: MealData) => {
    setRestaurants(
      restaurants.map((restaurant) => {
        if (restaurant.id === id) {
          // 如果已经去过并且没有提供新的 visitData，则切换回未去状态
          if (restaurant.visited && !visitData) {
            return { ...restaurant, visited: false, visitData: undefined }
          }
          // 否则，设置为已去状态并更新 visitData
          return { ...restaurant, visited: true, visitData }
        }
        return restaurant
      }),
    )
  }

  // 计算已去和未去的数量
  const visitedCount = restaurants.filter((restaurant) => restaurant.visited).length
  const notVisitedCount = restaurants.length - visitedCount

  return (
    <div className="container mx-auto px-4 py-8">
      <Header eatenCount={visitedCount} notEatenCount={notVisitedCount} visitedLabel="已去" notVisitedLabel="未去" />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onToggle={toggleVisited} />
        ))}
      </motion.div>
    </div>
  )
}
