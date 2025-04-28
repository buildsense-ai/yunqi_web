"use client"

import { usePathname } from "next/navigation"
import MobileNav from "./mobile-nav"

export default function MobileHeader() {
  const pathname = usePathname()
  const isRestaurantPage = pathname.includes("restaurants")

  return (
    <div className="flex items-center justify-between p-4 border-b md:hidden">
      <MobileNav />
      <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
        {isRestaurantPage ? "广州餐厅探索" : "广州美食探索"}
      </h1>
      <div className="w-6" /> {/* 占位，保持标题居中 */}
    </div>
  )
}
