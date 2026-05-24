import { create } from "zustand"

import type {
  UserResponse,
} from "../types/response/response.type"

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/request/auth.request"

import type { ApiResponse } from "../types/response/api.response"

import { authService } from "../services/auth.service"
import { cookieStorage } from "../utils/cookie"
import { useConversationStore } from "./conversationStore"

type AuthState = {
  token: string | null
  isAuth: boolean

  user: UserResponse | null

  loading: boolean
  error: string | null

  setAuth: (token: string) => void
  setUser: (user: UserResponse) => void

  initAuth: () => Promise<boolean>

  login: (
    payload: LoginRequest
  ) => Promise<ApiResponse<unknown>>

  signup: (
    payload: RegisterRequest
  ) => Promise<ApiResponse<unknown>>

  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: cookieStorage.getToken() || null,
  isAuth: !!cookieStorage.getToken(),
  user: null,
  loading: false,
  error: null,

  setAuth: (token) =>
    set({
      token,
      isAuth: true,
    }),

  setUser: (user) =>
    set({
      user,
    }),


  initAuth: async () => {
    try {
      set({
        loading: true,
        error: null,
      })

      const token = cookieStorage.getToken()

      if (!token) {
        set({ loading: false })
        return false
      }
      const [meRes,] = await Promise.all([
        authService.getMe(),
      ])

      if ( meRes.code === 200 && meRes.data ) {
        set({
          user: meRes.data,
          token: cookieStorage.getToken(),
          isAuth: true,
        })
        return true
      }
      throw meRes
    } catch (err) {
      const errorResponse = err as ApiResponse<null>
      set({
        error: errorResponse.message,
        token: null,
        isAuth: false,
        user: null,
      })
      cookieStorage.removeToken()
      return false
    } finally {
      set({
        loading: false,
      })
    }
  },

  


  login: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      })
      const response = await authService.login(payload)
      if (response.code === 200 && response.data) {
        cookieStorage.setToken(response.data.token)

        set({
          token: response.data.token,
          isAuth: true,
        })

        return response
      }

      throw response
    } catch (err) {
      const errorResponse = err as ApiResponse<null>

      set({
        error: errorResponse.message,
      })

      throw errorResponse
    } finally {
      set({
        loading: false,
      })
    }
  },

  signup: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      })

      const response = await authService.signup(payload)

      if (response.code === 200 && response.data) {
        cookieStorage.setToken(response.data.token)

        set({
          token: response.data.token,
          isAuth: true,
        })

        return response
      }

      throw response
    } catch (err) {
      const errorResponse = err as ApiResponse<null>

      set({
        error: errorResponse.message,
      })

      throw errorResponse
    } finally {
      set({
        loading: false,
      })
    }
  },

  logout: () => {
    cookieStorage.removeToken()
    set({
      token: null,
      isAuth: false,
      user: null,
      error: null,
    })
    useConversationStore.getState().clearConversationState()
  },
  // checkAuth: () => {
  //   return useAuthStore.getState().isAuth;
  // }
}))