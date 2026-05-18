import { create } from "zustand"

type AuthState = {
  token: string | null
  isAuth: boolean

  setAuth: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuth: false,

  setAuth: (token) =>
    set({
      token,
      isAuth: true,
    }),

  logout: () =>
    set({
      token: null,
      isAuth: false,
    }),
}))