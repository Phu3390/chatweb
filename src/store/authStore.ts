import { create } from "zustand"

import type {
  UserResponse,
  ConversationSummaryResponse,
} from "../types/response/response.type"

import type {
  LoginRequest,
  RegisterRequest,
} from "../types/request/auth.request"

import type { ApiResponse } from "../types/response/api.response"

import { authService } from "../services/auth.service"
import { conversationService } from "../services/conversation.service"
import { cookieStorage } from "../utils/cookie"

type AuthState = {
  token: string | null
  isAuth: boolean

  user: UserResponse | null
  conversations: ConversationSummaryResponse[]

  loading: boolean
  error: string | null

  setAuth: (token: string) => void
  setUser: (user: UserResponse) => void
  setConversations: (
    conversations: ConversationSummaryResponse[]
  ) => void

  initAuth: () => Promise<boolean>

  login: (
    payload: LoginRequest
  ) => Promise<ApiResponse<unknown>>

  signup: (
    payload: RegisterRequest
  ) => Promise<ApiResponse<unknown>>

  logout: () => void

  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: cookieStorage.getToken() || null,
  isAuth: !!cookieStorage.getToken(),

  user: null,
  conversations: [],

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

  setConversations: (conversations) =>
    set({
      conversations,
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
      const [meRes, convRes] = await Promise.all([
        authService.getMe(),
        conversationService.getMyConversations(),
      ])

      if (
        meRes.code === 200 &&
        convRes.code === 200 &&
        meRes.data &&
        convRes.data
      ) {
        set({
          user: meRes.data,
          conversations: convRes.data,
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
        conversations: [],
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
      conversations: [],
      error: null,
    })
  },

  clearAuth: () =>
    set({
      token: null,
      isAuth: false,
      user: null,
      conversations: [],
      error: null,
    }),

  // checkAuth: () => {
  //   return useAuthStore.getState().isAuth;
  // }
}))