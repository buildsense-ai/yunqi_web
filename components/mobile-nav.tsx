"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Utensils, Store } from "lucide-react"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "美食", path: "/", icon: <Utensils className="w-5 h-5" /> },
    { name: "餐厅", path: "/restaurants", icon: <Store className="w-5 h-5" /> },
  ]

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-600 hover:text-pink-600 focus:outline-none"
        aria-label="打开菜单"
      >
        <Menu className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text">
                  pilibebe的广州美食探索之旅
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-600 hover:text-pink-600 focus:outline-none"
                  aria-label="关闭菜单"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4">
                <ul className="space-y-2 px-3">
                  {navItems.map((item) => {
                    const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path)

                    return (
                      <li key={item.path}>
                        <Link href={item.path} passHref>
                          <div
                            className={`flex items-center px-4 py-3 rounded-lg transition-colors relative ${
                              isActive
                                ? "text-pink-600 font-medium"
                                : "text-gray-600 hover:text-pink-600 hover:bg-pink-50"
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="mobileActiveNav"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
