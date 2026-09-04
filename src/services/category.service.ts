import {api,publicAPI} from './api'
import type{
    Category
} from  '@/types/category'

export const getcategories = async():Promise<Category[]> =>{
    const response = await publicAPI.get<Category[]>('/api/categories/');
    return response.data
}