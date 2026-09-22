import {create} from 'zustand';
import type {User} from '@/types/auth';


interface AuthState {
    user:User|null;
    accessToken:string|null;
    refreshToken:string|null;
   isAuthenticated:boolean;
   isLoading:boolean

   setAuth:(
user:User,
accessToken:string,
refreshToken:string,
   )=>void;

   setTokens:(
    accessToken:string,
    refreshToken:string
   )=>void;

   setUser: (user:User)=>void;

   clearAuth:()=>void;

   setLoading: (loading:boolean) =>void;
}


export const useAuthStore = create<AuthState>((set)=>({
    user:null,
    accessToken:null,
    refreshToken:null,
    isAuthenticated:false,
    isLoading:true,

    setAuth:(user,accessToken,refreshToken)=>
        set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated:true,
            isLoading:false,
        }),
        setTokens:(accessToken,refreshToken)=>
            set({
                accessToken,
                refreshToken,
                // isAuthenticated:true,
                // isLoading:false
            }),
            setUser: (user)=>
                set({
                    user,
                }),
        setLoading:(loading)=>
            set({
                isLoading:loading
            }),

    clearAuth:()=>
        set({
            user:null,
            accessToken:null,
            refreshToken:null,
            isAuthenticated:false,
            isLoading:false
        }),
        
}))