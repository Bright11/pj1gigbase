import { View, Text , StyleSheet, TouchableOpacity} from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthHeader } from '@/features/auth/AuthHeader'
import { LoginForm } from '@/features/auth/LoginForm'
import { router, useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Mycolors } from '@/constants/mycolors'

export default function LoginScreen() {
    const navigation=useNavigation()
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"",
             headerShown: true,
             
             headerLeft:()=>(
                <View style={styles.topheader}>
                  <TouchableOpacity  
          // onPress={() => navigation.goBack()} 
          onPress={()=> router.push('/(tabs)')}
          style={[{ paddingHorizontal: 10, }]}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
                </View>
             ),
        //      headerRight:()=>(
        //         <TouchableOpacity 
        //   onPress={() => navigation.goBack()} 
        //   style={{ paddingHorizontal: 10,backgroundColor:Mycolors.primarycolor }}
        // >
        //   <Ionicons name="arrow-back" size={24} color="#007AFF" />
        // </TouchableOpacity>
        //      )
        })
    })
  return (
   <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
     
         <AuthHeader
        title='Welcome back'
        subtitle='Login to your PJ1 GIGBASE account'
        />
   
       
        <LoginForm/>
       

    </View>

   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea:{
        flex:1,
        // backgroundColor:Mycolors.whitecolor
    },
    container:{
        flex:1,
        paddingHorizontal:24,
        paddingTop:40,
        //  backgroundColor:Mycolors.whitecolor
    },
    topheader:{
      backgroundColor:Mycolors.whitecolor,
      paddingTop:6,
      paddingBottom:6,
      width:"100%"
    }
})
