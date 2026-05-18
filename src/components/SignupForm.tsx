import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

import { Input } from "./ui/input"
import { useAuth } from "../hooks/useAuth"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { toast } from "react-hot-toast"
import {  validateSignup } from "../utils/validate"



export default function SignupForm() {
  const navigate = useNavigate()
  const { signup, loading } = useAuth()

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
      className="rounded-2xl border bg-background p-8 shadow-sm"
    >
      <div className="text-center mb-6 space-y-1">
        <h2 className="text-3xl font-bold">Tạo tài khoản</h2>
        <p className="text-muted-foreground text-sm">
          Bắt đầu chat realtime ngay 🚀
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* name */}
        <div className="space-y-2">
          <Label>Họ tên</Label>
          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Nguyễn Văn A"
          />
        </div>

        {/* email */}
        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
          />
        </div>

        {/* password */}
        <div className="space-y-2">
          <Label>Mật khẩu</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {/* button */}
        <Button className="w-full" disabled={loading}>
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      {/* footer */}
      <p className="text-center text-sm mt-5 text-muted-foreground">
        Đã có tài khoản?{" "}
        <span
          className="text-primary cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Đăng nhập
        </span>
      </p>
    </motion.div>
  )
}