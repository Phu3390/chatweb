import type {
  LoginRequest,
  RegisterRequest,
} from "../types/request/auth.request";
import type { ApiResponse } from "../types/response/api.response";
import type {
  AuthResponse,
  UserResponse,
} from "../types/response/response.type";
import { axiosClient } from "./axios";

export const authService = {
  login: async (payload: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post<AuthResponse, LoginRequest>("/api/login", payload);
  },

  signup: async (
    payload: RegisterRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    return axiosClient.post<AuthResponse, RegisterRequest>(
      "/api/signup",
      payload,
    );
  },

  getMe: async (): Promise<ApiResponse<UserResponse>> => {
    return axiosClient.get<UserResponse>("/api/me");
  },
};

export default authService;
