export interface MealData {
  date: string
  weather: string
  location: string
}

export interface FoodItem {
  id: string
  name: string
  category: string
  eaten: boolean
  image: string
  mealData?: MealData
}

export interface RestaurantItem {
  id: string
  name: string
  category: string
  visited: boolean
  image: string
  visitData?: MealData
}
