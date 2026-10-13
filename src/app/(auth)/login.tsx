import { View, Text , StyleSheet, TouchableOpacity, Pressable, ScrollView} from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthHeader } from '@/features/auth/AuthHeader'
import { LoginForm } from '@/features/auth/LoginForm'
import { router, useNavigation } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Mycolors } from '@/constants/mycolors'
import { StatusBar } from 'expo-status-bar'

export default function LoginScreen() {
    const navigation=useNavigation()
    useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerTitle: "",
    headerStyle: {
      backgroundColor: Mycolors.primarycolor,
    },
    headerLeft: () => (
      <Pressable
        onPress={() => router.push("/")}
        style={{
          marginLeft: 10,
          padding: 8,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
        />
      </Pressable>
    ),
    headerRight:()=>(
      <Text style={[,{color:Mycolors.whitecolor}]}>Login</Text>
    )
  });
}, [navigation]);
  return (
   <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
   
     <ScrollView>
  <AuthHeader
        title='Welcome back'
        subtitle='Login to your PJ1 GIGBASE account'
        newstyles={{color:Mycolors.whitecolor}}
        />
        <LoginForm/>
       
     </ScrollView>
       


   </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeArea:{
        flex:1,
        // backgroundColor:Mycolors.whitecolor
    },
    // container:{
    //     flex:1,
    //     paddingHorizontal:24,
    //     // paddingTop:40,
    //     //  backgroundColor:Mycolors.whitecolor
    // },
    topheader:{
      backgroundColor:Mycolors.whitecolor,
      paddingTop:6,
      paddingBottom:6,
      width:"100%"
    }
})
