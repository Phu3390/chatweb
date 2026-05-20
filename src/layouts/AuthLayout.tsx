import type { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090d] text-slate-100">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
      <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-fuchsia-500 via-indigo-500 to-cyan-400 opacity-80" />
      <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden border-r border-white/10 bg-white/2 lg:flex flex-col justify-center p-12">
          <div className="mx-auto max-w-md space-y-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)]">
              <span className="text-2xl font-semibold text-cyan-300">C</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-white">
                Chat Realtime
              </h1>
              <p className="text-lg leading-8 text-slate-300">
                Kết nối bạn bè, nhắn tin realtime, tạo nhóm trò chuyện dễ dàng.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout