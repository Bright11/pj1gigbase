import { publicAPI } from './api';
import type {
  Category,
  PaginatedCategoryResponse,
} from '@/types/category';

export const getcategories = async (
  page = 1,
  pageSize = 10,
): Promise<PaginatedCategoryResponse> => {
  const response = await publicAPI.get<PaginatedCategoryResponse>(
    '/api/categories/',
    {
      params: {
        page,
        page_size: pageSize,
      },
    },
  );

  return response.data;
};

