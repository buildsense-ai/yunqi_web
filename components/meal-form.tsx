"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Cloud, MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MealFormProps {
  onSubmit: (data: MealData) => void
  onCancel: () => void
}

export interface MealData {
  date: string
  weather: string
  location: string
}

export default function MealForm({ onSubmit, onCancel }: MealFormProps) {
  const [formData, setFormData] = useState<MealData>({
    date: new Date().toISOString().split("T")[0],
    weather: "晴朗",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const weatherOptions = ["晴朗", "多云", "小雨", "大雨", "雪", "雾", "阴天"]

  return (
    <motion.div
      className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl z-10 p-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-pink-500">记录美食体验 ✨</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date" className="flex items-center gap-1 text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>日期</span>
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
            required
          />
        </div>

        <div>
          <Label htmlFor="weather" className="flex items-center gap-1 text-gray-700">
            <Cloud className="h-4 w-4" />
            <span>天气</span>
          </Label>
          <Select value={formData.weather} onValueChange={(value) => setFormData({ ...formData, weather: value })}>
            <SelectTrigger className="w-full mt-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500">
              <SelectValue placeholder="选择天气" />
            </SelectTrigger>
            <SelectContent>
              {weatherOptions.map((weather) => (
                <SelectItem key={weather} value={weather}>
                  {weather}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location" className="flex items-center gap-1 text-gray-700">
            <MapPin className="h-4 w-4" />
            <span>地点</span>
          </Label>
          <Input
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
            placeholder="在哪里吃的呢？"
            required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
          >
            记录下来！
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
