import { Send } from "lucide-react"

export default function ChatInput() {
  return (
    <div
      className="
        border-t
        border-slate-200
        bg-white
        p-3

        dark:border-white/10
        dark:bg-[#0f172a]
      "
    >
      <div
        className="
          flex items-center gap-3
          rounded-xl
          border

          border-slate-200
          bg-slate-100

          px-4

          dark:border-white/10
          dark:bg-[#111b24]
        "
      >
        <input
          placeholder="Nhập tin nhắn..."
          className="
            h-14 flex-1
            bg-transparent
            outline-none

            text-slate-900
            placeholder:text-slate-400

            dark:text-white
            dark:placeholder:text-white/40
          "
        />

        <button
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl

            bg-cyan-400
            text-black

            transition
            hover:scale-105
            hover:bg-cyan-300
          "
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}