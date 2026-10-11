
export interface Category {
  id: number;
  name: string;
  avatar: string | null;
  image: string | null;
  description: string | null;
  slug: string;
  created_at: string;
}

export interface CategoryPaginationLinks {
  next: string | null;
  next_page: number | null;
  previous: string | null;
}

export interface PaginatedCategoryResponse {
  links: CategoryPaginationLinks;
  count: number;
  total_pages: number;
  current_page: number;
  results: Category[];
}

