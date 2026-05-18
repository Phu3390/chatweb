import { useAuthStore } from "../store/authStore"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }: any) {
  const isAuth = useAuthStore((s) => s.isAuth)

  if (!isAuth) {
    return <Navigate to="/login" />
  }

  return children
}