"use client"

import { useEffect } from "react"

interface UseKeyboardNavigationProps {
  onNext: () => void
  onPrevious: () => void
  enabled?: boolean
}

export function useKeyboardNavigation({ onNext, onPrevious, enabled = true }: UseKeyboardNavigationProps) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        onNext()
      } else if (event.key === "ArrowLeft") {
        onPrevious()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onNext, onPrevious, enabled])
}
