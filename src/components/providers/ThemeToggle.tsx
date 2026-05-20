import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = currentTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        relative flex h-10 w-[78px]
        items-center rounded-full

        border border-white/10
        bg-white/10 dark:bg-white/5

        shadow-sm backdrop-blur-md
        p-1 transition-all
      "
    >
      {/* SLIDER */}
      <div
        className={`
          absolute top-1
          h-8 w-8 rounded-full
          bg-white shadow-md
          transition-all duration-300

          ${isDark ? "translate-x-[38px]" : "translate-x-0"}
        `}
      />

      {/* SUN */}
      <div className="z-10 flex-1 flex justify-center">
        <Sun
          size={16}
          className={`
            transition-colors
            ${isDark ? "text-white/40" : "text-yellow-500"}
          `}
        />
      </div>

      {/* MOON */}
      <div className="z-10 flex-1 flex justify-center">
        <Moon
          size={16}
          className={`
            transition-colors
            ${isDark ? "text-blue-300" : "text-slate-700"}
          `}
        />
      </div>
    </button>
  )
}