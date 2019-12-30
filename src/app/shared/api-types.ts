export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  token: string;
  expiresIn: number;
  username: string;
}