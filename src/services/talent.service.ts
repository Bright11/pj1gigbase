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


// export const uploadTalentVideo = async(
//     talentId:number,
//     vaideouri:string
// )=>{
//     const formData= new FormData();
//     formData.append('talent_id', String(talentId))
//     formData.append('video',{
//         uri:vaideouri,
//         name:`talent-${talentId}-${Date.now()}.mp4`,
//         type:'video/mp4'
//     } as any)

//     const response = await api.post(
//         '/api/upload-talent-video/',formData,{
//             headers:{
//                 'Content-Type':'multipart/form-data',
//             }
//         }
//     );
//     return response.data
// }





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


export const getPublicTalents = async (
  page: number = 1,
  search: string = '',
): Promise<PublicTalentPagination> => {

  console.log(
    'PUBLIC TALENT REQUEST:',
    page,
    search,
  );

  const response = await api.get(
    '/api/public-talents/',
    {
      params: {
        page,
        q: search.trim() || undefined,
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




