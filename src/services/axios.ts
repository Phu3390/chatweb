// src/services/axios.ts

import axios, { AxiosError } from "axios"

import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios"
import type { ApiResponse } from "../types/response/api.response"
import { cookieStorage } from "../utils/cookie"


const BASE_URL = import.meta.env.VITE_API_URL

const PUBLIC_ROUTES = ["/api/login", "/api/signup"]

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})


api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookieStorage.getToken()

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      config.url?.includes(route)
    )

    if (token && !isPublicRoute) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => {
    return response.data
  },

  (error: AxiosError<ApiResponse<null>>) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data)
    }

    return Promise.reject({
      code: 500,
      message: "Server connection failed",
      data: null,
    } satisfies ApiResponse<null>)
  }
)


export const axiosClient = {
  get: async <T, P = Record<string, unknown>>(
    url: string,
    params?: P
  ): Promise<ApiResponse<T>> => {
    return api.get(url, { params })
  },

  post: async <T, B = unknown>(
    url: string,
    body?: B
  ): Promise<ApiResponse<T>> => {
    return api.post(url, body)
  },

  put: async <T, B = unknown>(
    url: string,
    body?: B
  ): Promise<ApiResponse<T>> => {
    return api.put(url, body)
  },

  patch: async <T, B = unknown>(
    url: string,
    body?: B
  ): Promise<ApiResponse<T>> => {
    return api.patch(url, body)
  },

  delete: async <T>(
    url: string
  ): Promise<ApiResponse<T>> => {
    return api.delete(url)
  },
}

export default axiosClient
export { api };