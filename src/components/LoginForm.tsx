import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import toast from "react-hot-toast"
import { validateLogin } from "../utils/validate"



function LoginForm() {
  const navigate = useNavigate()

  const { login, loading, error } = useAuth()

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
      // navigate("/chat")
    } catch  {
      // lỗi đã xử lý ở hook
      toast.error(error || "Đăng nhập thất bại")
    }
  }

  return (
    <div className="rounded-2xl border bg-background p-8 shadow-sm">
      <div className="space-y-2 text-center mb-6">
        <h2 className="text-3xl font-bold">Đăng nhập</h2>
        <p className="text-muted-foreground">
          Nhập thông tin để tiếp tục
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>

          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => navigate("/signup")}
        >
          Đăng ký
        </span>
      </p>
    </div>
  )
}

export default LoginForm