"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import FoodCard from "./food-card"
import Header from "./header"

// 食物数据类型
interface FoodItem {
  id: string
  name: string
  category: string
  eaten: boolean
  image: string
  mealData?: {
    date: string
    weather: string
    location: string
  }
}

export default function FoodDashboard() {
  // 初始食物数据
  const [foods, setFoods] = useState<FoodItem[]>([
    {
      id: "1",
      name: "鸡",
      category: "肉类",
      eaten: false,
      image: "/happy-hen-meal.png",
    },
    {
      id: "2",
      name: "早茶",
      category: "粤式",
      eaten: false,
      image: "/happy-dim-sum-friends.png",
    },
    {
      id: "3",
      name: "煲仔饭",
      category: "粤式",
      eaten: false,
      image: "/happy-clay-pot.png",
    },
    {
      id: "4",
      name: "意大利菜",
      category: "西餐",
      eaten: false,
      image: "/happy-italian-feast.png",
    },
    {
      id: "5",
      name: "牛肉火锅",
      category: "火锅",
      eaten: false,
      image: "/happy-hotpot.png",
    },
    {
      id: "6",
      name: "意面",
      category: "西餐",
      eaten: false,
      image: "/happy-pasta-friends.png",
    },
    {
      id: "7",
      name: "广州煎面",
      category: "粤式",
      eaten: false,
      image: "/happy-noodle-bowl.png",
    },
  ])

  // 切换食物的吃了/没吃状态
  const toggleEaten = (id: string, mealData?: { date: string; weather: string; location: string }) => {
    setFoods(
      foods.map((food) => {
        if (food.id === id) {
          // 如果已经吃过并且没有提供新的 mealData，则切换回未吃状态
          if (food.eaten && !mealData) {
            return { ...food, eaten: false, mealData: undefined }
          }
          // 否则，设置为已吃状态并更新 mealData
          return { ...food, eaten: true, mealData }
        }
        return food
      }),
    )
  }

  // 计算已吃和未吃的数量
  const eatenCount = foods.filter((food) => food.eaten).length
  const notEatenCount = foods.length - eatenCount

  return (
    <div className="container mx-auto px-4 py-8">
      <Header eatenCount={eatenCount} notEatenCount={notEatenCount} />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} onToggle={toggleEaten} />
        ))}
      </motion.div>
    </div>
  )
}
