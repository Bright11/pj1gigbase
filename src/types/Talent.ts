export interface TalentCategory {
  id: number;
  name: string;
  avatar: string | null;
  image: string | null;
  description: string | null;
  slug: string;
  created_at: string;
}

export interface TalentGalleryImage {
  id: number;
  caption: string | null;
  image_url: string | null;
}

export interface TalentVideo {
  id: number;
  video_url: string | null;
  caption:string |null,
  source:TalentVideoSource;
  url:string |null
}

export interface Talent {
  id: number;
  user_id:number,
  stage_name: string | null;
  slug: string;
  title: string;
  bio?: string | null;

  category_details: TalentCategory | null;

  hourly_rate: string | null;
  fixed_rate: string | null;
  currency: string;
  is_charges_enabled:boolean;
  is_price_negotiable:boolean;

  is_available: boolean;
  rating: string;
  total_bookings: number;

  gallery_images: TalentGalleryImage[];
  videos: TalentVideo[];

  created_at?: string;
  updated_at?: string;
}

export interface CreateTalentRequest {
  stage_name?: string;
  category: number;
  title: string;
  bio?: string;
  hourly_rate?: string;
  fixed_rate?: string;
  currency: string;
}



export type TalentVideoSource =
  | 'cloudinary'
  | 'youtube'
  | 'tiktok';




export interface PublicTalentImage {
  id: number;
  image_url: string | null;
  caption: string | null;
}

export interface PublicTalentVideo {
  id: number;
  talent: number;
  video_url: string | null;
  caption: string | null;
}

export interface PublicTalent {
  id: number;
  user_id:number,
  stage_name: string;
  slug: string;
  title: string;

  user_details: {
    username: string;
    email: string;
    id:number
  };

  hourly_rate: string;
  fixed_rate: string;
  currency: string;
  is_charges_enabled:boolean;
  is_price_negotiable:boolean

  gallery_images: PublicTalentImage[];

  is_available: boolean;
  rating: string;
  total_bookings: number;

  video_details: PublicTalentVideo[];

  userprofile: {
    phone_number: string;
    date_of_birth: string | null;
    profile_picture: string | null;
    country: string;
    city: string;
    bio: string | null;
    first_name: string | null;
    last_name: string | null;
    gender: string | null;
  };
}

export interface PublicTalentPagination {
  links: {
    next: string | null;
    next_page: number | null;
    previous: string | null;
  };

  count: number;
  total_pages: number;
  current_page: number;
  results: PublicTalent[];
}