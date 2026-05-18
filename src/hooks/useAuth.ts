import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import type { LoginRequest, RegisterRequest } from "../types/request/auth.request"
import type { ApiResponse } from "../types/response/api.response"
import { authService } from "../services/auth.service"
import { cookieStorage } from "../utils/cookie"



export const useAuth = () => {
  const { token, isAuth, setAuth, logout: clearAuth } = useAuthStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (
    payload: LoginRequest
  ): Promise<ApiResponse<unknown>> => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.login(payload)

      if (response.code === 200 && response.data) {
        cookieStorage.setToken(response.data.token)

        setAuth(response.data.token)

        return response
      }

      throw response
    } catch (err) {
      const errorResponse = err as ApiResponse<null>

      setError(errorResponse.message)

      throw errorResponse
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    payload: RegisterRequest
  ): Promise<ApiResponse<unknown>> => {
    try {
      setLoading(true)
      setError(null)

      const response = await authService.signup(payload)

      if (response.code === 200 && response.data) {
        cookieStorage.setToken(response.data.token)

        setAuth(response.data.token)

        return response
      }

      throw response
    } catch (err) {
      const errorResponse = err as ApiResponse<null>

      setError(errorResponse.message)

      throw errorResponse
    } finally {
      setLoading(false)
    }
  }


  const logout = () => {
    cookieStorage.removeToken()
    clearAuth()
  }


  return {
    token,
    isAuth,

    loading,
    error,

    login,
    signup,
    logout,
  }
}