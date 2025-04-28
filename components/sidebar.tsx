"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Utensils, Store } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    { name: "美食", path: "/", icon: <Utensils className="w-5 h-5" /> },
    { name: "餐厅", path: "/restaurants", icon: <Store className="w-5 h-5" /> },
  ]

  return (
    <div className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
          pilibebe的广州美食探索之旅
        </h1>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => {
            const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)

            return (
              <li key={item.path}>
                <Link href={item.path} passHref>
                  <div
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                      isActive ? "text-pink-600 font-medium" : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-pink-100 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
