import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function GuestRoute({
  children,
}: any) {
  const token = useAuthStore((s) => s.token)

  if (token) {
    return <Navigate to="/chat" replace />
  }

  return children
}