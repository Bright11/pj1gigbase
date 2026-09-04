import { getStoredTokens, getCurrentUser,refreshAccessToken } from "./auth.service";
import { useAuthStore } from "@/store/auth.store";

export const restoreSession = async ()=>{
    const{
        setAuth,
        clearAuth,
        setLoading,
    } = useAuthStore.getState();

    try{
        setLoading(true);
        const{
            accessToken,
            refreshToken,

        } = await getStoredTokens()

        if(!accessToken || !refreshToken){
            clearAuth()
            return
        }

        try{
            const user = await  getCurrentUser();

        setAuth(
            user,
            accessToken,
            refreshToken
        );
        return

        }catch (error:any){
            // only attempt refresh when the access token is rejected
            if(error?.response?.status !==401){
                throw error
            }
        }
        // access token expired or invalide - refresh it
        const newAccessToken = await refreshAccessToken(
            refreshToken
        );
        // Getting the user again using the new access token
        const user = await getCurrentUser();
        setAuth(
            user,
            newAccessToken,
            refreshToken
        )
    }catch (error){
        console.log("session restore failed", error)
        clearAuth()
    }finally{
        setLoading(false)
    }
}