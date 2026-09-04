
export interface UserProfile {
  first_name: string | null;
  last_name: string | null;
  phone_number: string;
  date_of_birth: string | null;
  gender: string | null;
  profile_picture: string | null;
  country: string;
  city: string;
  bio: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_verified: boolean;
  profile: UserProfile;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

