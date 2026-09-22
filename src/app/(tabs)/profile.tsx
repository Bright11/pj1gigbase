import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { Mycolors } from '@/constants/mycolors'
import { ProtectedRoute } from '@/utils/ProtectedRoute'
import { logout } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { Redirect, router } from 'expo-router'

export default function profile() {
    const {isAuthenticated,isLoading}=useAuthStore()
    // if(isLoading){
    //     return null
    // }
    // if(!isAuthenticated){
    //     return <Redirect href="/login"/>
    //     //  router.push('/login'); 
    // }
      const handlelogout = async()=>{
        await logout()
    }
  return (
   <ProtectedRoute>
     <View style={styles.container }> 
      <Text style={{color:Mycolors.whitecolor,  marginTop:67}}>profile</Text>
    </View>

     <Pressable style={styles.container } onPress={handlelogout}>  
      <Text style={{color:Mycolors.whitecolor,  marginTop:67}}>Logout</Text>
    
      </Pressable>
    
   </ProtectedRoute>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
      

    }
})