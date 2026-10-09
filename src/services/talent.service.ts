import { api } from "./api";

import type { CreateTalentRequest,PublicTalent,PublicTalentPagination,Talent, TalentVideoSource } from "@/types/Talent";


export const createTalent= async(
    data:CreateTalentRequest
)=>{
    const response = await api.post('/api/talent/',data)
    return response.data;
}


export const getMyTalents = async ():Promise<Talent[]> =>{
    const response = await api.get<Talent[]>(
        '/api/talent/'
    )
    return response.data
}

export const getTalent = async (id:number):Promise<Talent>=>{
    const response = await api.get<Talent>(
        `/api/talent/${id}/`
    )
    return response.data
}



export const uploadGalleryImage = async(
    talentId:number,
    imageUri:string
)=>{
    const formData = new FormData();
    formData.append('talent_id', String(talentId));
    formData.append('image',{
        uri:imageUri,
        name:`talent-${talentId}-${Date.now()}.jpg`,
        type:'image/jpeg',
    } as any)

    const response = await api.post(
        "/api/upload-gallery-image/",
        formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
    );
    return response.data
}





export const uploadTalentVideo = async (
  talentId: number,
  source: TalentVideoSource,
  videoUri?: string,
  url?: string
) => {
  const formData = new FormData();

  formData.append(
    'talent_id',
    String(talentId)
  );

  formData.append(
    'source',
    source
  );

  if (source === 'cloudinary' && videoUri) {
    formData.append('cloudinary_video', {
      uri: videoUri,
      name: `talent-${talentId}-${Date.now()}.mp4`,
      type: 'video/mp4',
    } as any);
  }

  if (
    (source === 'youtube' || source === 'tiktok') &&
    url
  ) {
    formData.append('url', url);
  }

  const response = await api.post(
    '/api/talent-videos/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};


export const deleteTalentVideo = async (videoId:number):Promise<any>=>{
    const response = await api.delete(
        `/api/talent-videos/${videoId}/`,
    );
    return response.data
}

export const deleteGalleryImage = async (
  imageId: number
) => {
  const response = await api.delete(
     `/api/delete-gallery-image/${imageId}/`
  );

  return response.data;
};


// export const getPublicTalents = async (
//   page: number = 1,
// ): Promise<PublicTalentPagination> => {
//   const response = await api.get(
//     `/api/public-talents/?page=${page}`,
//   );

//   return response.data;
// };

// export const getPublicTalents = async ( 
//   page: number = 1, search: string = '', 
// ): Promise<PublicTalentPagination> => {
//    const response = await api.get(
//      '/api/public-talents/', { params: { page, q: search.trim() || undefined, }, }, ); 
//      return response.data;
//      };


// export const getPublicTalents = async (
//   page: number = 1,
//   search: string = '',
// ): Promise<PublicTalentPagination> => {

//   console.log(
//     'PUBLIC TALENT REQUEST:',
//     page,
//     search,
//   );

//   const response = await api.get(
//     '/api/public-talents/',
//     {
//       params: {
//         page,
//         q: search.trim() || undefined,
//       },
//     },
//   );

//   console.log(
//     'PUBLIC TALENT URL:',
//     response.config.url,
//   );

//   return response.data;
// };

export const getPublicTalents = async (
  page: number = 1,
  search: string = '',
  country?: string,
  category?: string,
): Promise<PublicTalentPagination> => {

  console.log(
    'PUBLIC TALENT REQUEST:',
    page,
    search,
    country,
    category,
  );

  const response = await api.get(
    '/api/public-talents/',
    {
      params: {
        page,
        q: search.trim() || undefined,
        country: country?.trim().toUpperCase() || undefined,
        category: category?.trim() || undefined,
      },
    },
  );

  console.log(
    'PUBLIC TALENT URL:',
    response.config.url,
  );

  return response.data;
};
export const getPublicTalentBySlug = async (
  slug: string,
): Promise<PublicTalent> => {
  const response = await api.get(
    `/api/public-talents/${slug}/`,
  );

  return response.data;
};


export const deleteTalent = async (
  talentId: number
) => {
  const response = await api.delete(
    `/api/talent/${talentId}/`
  );

  return response.data;
};


export const updateTalent = async (
  talentId: number,
  data: Partial<Talent>
) => {
  const response = await api.patch(
    `/api/talent/${talentId}/`,
    data
  );

  return response.data;
};




export const submitTalentReview = async (
  talentId: number,
  rating: number,
  comment: string,
) => {
  const response = await api.post(
    `/api/reviews/${talentId}/`,
    {
      rating,
      comment: comment.trim(),
    },
  );

  return response.data;
};

export const getMyTalentSkills = async () => {
  const response = await api.get(
    '/api/talent/skills/'
  );

  return response.data;
};

export const addTalentSkill = async (
  skillId: number
) => {
  const response = await api.post(
    '/api/talent/skills/',
    {
      skill_id: skillId,
    }
  );

  return response.data;
};

export const deleteTalentSkill = async (
  talentSkillId: number
) => {
  const response = await api.delete(
    `/api/talent/skills/${talentSkillId}/`
  );

  return response.data;
};

export const getAvailableSkills = async () => {
  const response = await api.get(
    '/api/skills/'
  );

  return response.data;
};

