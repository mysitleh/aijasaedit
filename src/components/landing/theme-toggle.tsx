
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // To prevent hydration mismatch and layout shift, render a placeholder.
    return <div className="h-8 w-14 rounded-full bg-secondary" />
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer items-center justify-between rounded-full bg-secondary p-1 transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
      aria-label="Ganti tema"
    >
      <span className="sr-only">Ganti tema</span>
      
      {/* Icons are positioned within the flex container */}
      <Sun className="h-5 w-5 text-yellow-400" />
      <Moon className="h-5 w-5 text-sky-400" />
      
      {/* The moving switch */}
      <span
        className={cn(
          "pointer-events-none absolute left-1 top-1 inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-300 ease-in-out",
          isDark ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  )
}
