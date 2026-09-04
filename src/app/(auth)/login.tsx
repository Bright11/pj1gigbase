import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthHeader } from '@/features/auth/AuthHeader'
import { LoginForm } from '@/features/auth/LoginForm'

export default function LoginScreen() {
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
        flex:1
    },
    container:{
        flex:1,
        paddingHorizontal:24,
        paddingTop:40
    }
})
