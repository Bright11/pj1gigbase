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
  stage_name: string | null;
  slug: string;
  title: string;
  bio?: string | null;

  category_details: TalentCategory | null;

  hourly_rate: string | null;
  fixed_rate: string | null;
  currency: string;

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

// export interface TalentVideo{
//     id:number;
//     source:'cloudinary'|'youtube'|'tiktok';
//     video_url:string |null
// }


export type TalentVideoSource =
  | 'cloudinary'
  | 'youtube'
  | 'tiktok';