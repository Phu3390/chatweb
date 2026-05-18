import type { ReactNode } from "react"

type AuthLayoutProps = {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-muted/30">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary text-primary-foreground p-10">
        <div className="max-w-md space-y-4">
          <h1 className="text-4xl font-bold">Chat Realtime</h1>
          <p className="text-lg opacity-90">
            Kết nối bạn bè, nhắn tin realtime, tạo nhóm trò chuyện dễ dàng.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}

export default AuthLayout