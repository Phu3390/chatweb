import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { toast } from "react-hot-toast"
import {  validateSignup } from "../utils/validate"
import { User, Mail, LockKeyhole, ArrowRight } from "lucide-react"
import { useAuthStore } from "../store/authStore"
const BASE_URL = import.meta.env.VITE_API_URL;



export default function SignupForm() {
  const navigate = useNavigate()
  const { signup, loading } = useAuthStore()

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  const handleLoginWithGoogle = () => {
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validateSignup(form)
    if (errorMsg) {
      toast.error(errorMsg)
      return
    }
    try {
      await signup(form)
      toast.success("Tạo tài khoản thành công!")
      navigate("/chat")
    } catch (err: any) {
      toast.error(err?.message || "Tạo tài khoản thất bại")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1016]/95 px-5 py-7 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-7 sm:py-8"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
      <div className="absolute -left-12 top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-12 bottom-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mb-7 space-y-3 text-left">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
          Tạo tài khoản
        </h2>
        <p className="text-sm leading-6 text-slate-400 sm:text-[15px]">
          Bắt đầu chat realtime ngay. Bắt đầu hoàn toàn miễn phí.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* fullName */}
        <div className="space-y-2.5">
          <Label htmlFor="fullName" className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Họ và tên
          </Label>

          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Nhập họ và tên của bạn"
              value={form.fullName}
              onChange={handleChange}
              required
              className="h-12 border-slate-800 bg-slate-900/80 pl-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* email */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Địa chỉ email
          </Label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="h-12 border-slate-800 bg-slate-900/80 pl-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* password */}
        <div className="space-y-2.5">
          <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Mật khẩu
          </Label>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
              className="h-12 border-slate-800 bg-slate-900/80 pl-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* button */}
        <Button
          type="submit"
          className="h-12 w-full rounded-xl border-0 bg-linear-to-r from-cyan-400 via-sky-500 to-fuchsia-500 font-semibold text-slate-950 shadow-[0_18px_40px_-18px_rgba(34,211,238,0.75)] transition-transform hover:-translate-y-px hover:from-cyan-300 hover:to-fuchsia-400 inline-flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? "Đang tạo tài khoản..." : (
            <>
              <span>Đăng ký ngay</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-slate-500">
        <span className="h-px flex-1 bg-white/10" />
        <span>Hoặc</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleLoginWithGoogle}
        className="h-12 w-full rounded-xl border-white/10 bg-white/3 text-slate-100 hover:bg-white/6 hover:text-white"
      >
        <span className="mr-3 flex h-5 w-5 items-center justify-center rounded-full bg-white">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path fill="#EA4335" d="M12 10.2v4.1h5.8c-.2 1.1-1.4 3.3-5.8 3.3-3.5 0-6.3-2.9-6.3-6.5S8.5 4.6 12 4.6c2 0 3.4.9 4.2 1.7l2.9-2.8C17.3 1.8 14.9.8 12 .8 6.8.8 2.5 5 2.5 10.2S6.8 19.6 12 19.6c5.4 0 8.9-3.8 8.9-9.1 0-.6 0-1-.1-1.4H12Z" />
            <path fill="#34A853" d="M3.5 7.5 7 10.1C7.9 7.4 10.4 5.5 12 5.5c2 0 3.4.9 4.2 1.7l2.9-2.8C17.3 1.8 14.9.8 12 .8 7.9.8 4.4 3.3 3.5 7.5Z" opacity="0.45" />
          </svg>
        </span>
        <span className="font-medium">Tiếp tục với Google</span>
      </Button>

      {/* footer */}
      <p className="mt-6 text-center text-sm text-slate-400">
        Đã có tài khoản?{" "}
        <span
          className="font-semibold text-cyan-300 cursor-pointer hover:text-cyan-200 hover:underline"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </span>
      </p>
    </motion.div>
  )
}