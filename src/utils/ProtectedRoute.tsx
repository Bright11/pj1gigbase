import { Redirect } from "expo-router";
import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";


interface ProtectedRouteProps{
    children:ReactNode;
}

export function ProtectedRoute({children}:ProtectedRouteProps){
    const isAuthenticated = useAuthStore(
        (state)=>state.isAuthenticated
    );
    const isLoading = useAuthStore(
        (state)=>state.isLoading
    )
    if(isLoading){
        return null
    }
    if(!isAuthenticated){
        return <Redirect href="/login"/>
    }
    return <>{children}</>
}