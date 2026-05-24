export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  email?: string;
  fullName?: string;
  avatar?: string;
}
