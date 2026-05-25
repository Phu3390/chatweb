import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import toast from "react-hot-toast"
import { validateLogin } from "../utils/validate"
import { LockKeyhole, Mail, Sparkles } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import { cookieStorage } from "../utils/cookie"
const BASE_URL = import.meta.env.VITE_API_URL;



function LoginForm() {
  const navigate = useNavigate()
  const hasShownToast = useRef(false);

  const { login, loading, error } = useAuthStore()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLoginWithGoogle = () => {
    cookieStorage.removeSession();
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errorMsg = validateLogin(formData)
    if (errorMsg) {
      toast.error(errorMsg)
      return
    }
    try {
      await login(formData)
      toast.success("Đăng nhập thành công 🚀")
      navigate("/chat")
    } catch  {
      toast.error(error || "Đăng nhập thất bại")
    }
  }
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get("error");

    if (error === "NOT_LOGIN_WITH_GOOGLE" && !hasShownToast.current) {
      toast.error("Gmail của bạn đã có tài khoản, vui lòng đăng nhập bằng Gmail để tiếp tục");
      hasShownToast.current = true;
    }
  }, [location.search]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0c1016]/95 px-5 py-7 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)] backdrop-blur-xl sm:px-7 sm:py-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-cyan-400 via-indigo-500 to-fuchsia-500" />
      <div className="absolute -left-12 top-8 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -right-12 bottom-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative mb-7 space-y-3 text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
          <Sparkles className="h-3.5 w-3.5" />
          Welcome back
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
          Chào mừng trở lại
        </h2>
        <p className="text-sm leading-6 text-slate-400 sm:text-[15px]">
          Truy cập trung tâm trò chuyện của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
            Email
          </Label>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="piot@linuxa.sinthy"
              value={formData.email}
              onChange={handleChange}
              required
              className="h-12 border-slate-800 bg-slate-900/80 pl-10 text-slate-100 placeholder:text-slate-500 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password" className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
              Mật khẩu
            </Label>

            <button
              type="button"
              className="text-xs font-medium text-cyan-300 transition-colors hover:text-cyan-200"
            >
              Quên mật khẩu?
            </button>
          </div>

          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="h-12 border-slate-800 bg-slate-900/80 pl-10 pr-11 text-slate-100 placeholder:text-slate-500 focus-visible:border-cyan-400/50 focus-visible:ring-cyan-400/20"
            />

          </div>
        </div>


        <Button
          type="submit"
          className="h-12 w-full rounded-xl border-0 bg-linear-to-r from-cyan-400 via-sky-500 to-fuchsia-500 font-semibold text-slate-950 shadow-[0_18px_40px_-18px_rgba(34,211,238,0.75)] transition-transform hover:-translate-y-px hover:from-cyan-300 hover:to-fuchsia-400"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
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
      <p className="mt-6 text-center text-sm text-slate-400">
        Chưa có tài khoản?{" "}
        <span
          className="font-semibold text-cyan-300 cursor-pointer hover:text-cyan-200 hover:underline"
          onClick={() => navigate("/signup")}
        >
          Đăng ký
        </span>
      </p>
    </div>
  )
}

export default LoginForm