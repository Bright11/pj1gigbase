import {api,publicAPI} from './api';
import  * as SecureStore from 'expo-secure-store'
import { useAuthStore } from '@/store/auth.store';


import type{
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    User
} from '@/types/auth';


const ACCESS_TOKEN_KEY='access_token';
const REFRESH_TOKEN_KEY='refresh_token';



export const login = async (
    data:LoginRequest
):Promise<AuthResponse>=>{
   const response = await publicAPI.post<AuthResponse>(
    '/api/login/',data
   );
   const authData = response.data

   await SecureStore.setItemAsync(
    ACCESS_TOKEN_KEY,
    authData.access
   );
   await SecureStore.setItemAsync(
    REFRESH_TOKEN_KEY,
    authData.refresh
   );

   useAuthStore.getState().setAuth(
    authData.user,
    authData.access,
    authData.refresh
   )
   return authData
}


export const register = async (data:RegisterRequest):Promise<AuthResponse>=>{
    const response = await publicAPI.post<AuthResponse>('/api/register/',data);

    const authData=response.data;
    if(authData.access){
        await SecureStore.setItemAsync(
            ACCESS_TOKEN_KEY,
            authData.access
        )
    }
    if(authData.refresh){
        await SecureStore.setItemAsync(
            REFRESH_TOKEN_KEY,
            authData.refresh
        )
    }
    if(authData.user && authData.access && authData.refresh){
        useAuthStore.getState().setAuth(
            authData.user,
            authData.access,
            authData.refresh
        )
    }
    return authData
}

export const refreshAccessToken = async(
    refreshToken:string
):Promise<string>=>{
    const response = await publicAPI.post<{
        access:string;
    }>('/api/token/refresh/',{
        refresh:refreshToken
    });
    const newAccessToken = response.data.access
    await SecureStore.setItemAsync(
        ACCESS_TOKEN_KEY,
        newAccessToken
    );
    return newAccessToken

}


export const getCurrentUser = async ():Promise<User>=>{
    const response = await api.get<User>('/api/auth/user/');
    // console.log("user data info", response.data)
    return response.data
}

export const logout = async ()=>{
    await clearStoredTokens()
    useAuthStore.getState().clearAuth();
}

export const getStoredTokens = async ()=>{
    const accessToken = await SecureStore.getItemAsync(
        ACCESS_TOKEN_KEY
    )

    const refreshToken = await SecureStore.getItemAsync(
        REFRESH_TOKEN_KEY
    )

    return {
        accessToken,
        refreshToken
    }
}

export const clearStoredTokens = async ()=>{
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
}