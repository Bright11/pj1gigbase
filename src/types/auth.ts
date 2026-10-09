
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
  is_available:boolean;
  profile: UserProfile;
   dashboard: DashboardStats;
   phone_number?:string
}

export interface DashboardStats {
  talents: number;
  talent_bookings: number;
  client_bookings: number;
  pending_bookings: number;
  accepted_bookings: number;
  completed_bookings: number;
  unread_messages: number;
  unread_notifications: number;
  gallery_images: number;
  videos: number;
  bookings:number;
  
}

export interface CurrentUserResponse extends User {
  dashboard: DashboardStats;
}
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  country: string;
  country_name: string;
  password: string;
  confirmPassword: string;
  phone_number:string
}

export interface AuthResponse {
  refresh: string;
  access: string;
  user: User;
}

