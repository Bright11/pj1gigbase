import { api } from './api';

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  city?: string;
  bio?: string;
}

export interface UpdatedProfileResponse {
  message: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
    phone_number: string;
    date_of_birth: string | null;
    gender: string | null;
    profile_picture: string | null;
    country: string;
    city: string;
    bio: string | null;
  };
}

export const updateProfile = async (
  data: UpdateProfileData,
): Promise<UpdatedProfileResponse> => {
  const response = await api.patch<UpdatedProfileResponse>(
    '/api/profile/update/',
    data,
  );

  return response.data;
};



export const updateProfileImage = async (
  image: {
    uri: string;
    fileName?: string | null;
    mimeType?: string | null;
  }
) => {
  const formData = new FormData();

  formData.append('profile_picture', {
    uri: image.uri,
    name:
      image.fileName ||
      `profile-${Date.now()}`,
    type:
      image.mimeType ||
      'image/jpeg',
  } as any);

  const response = await api.patch(
    'api/profile/image/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const updateUserAvailability = async (
  isAvailable: boolean
) => {
  const response = await api.patch(
    '/api/user/availability/',
    {
      is_available: isAvailable,
    }
  );

  return response.data;
};


