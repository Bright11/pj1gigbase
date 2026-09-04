import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthHeader } from '@/features/auth/AuthHeader'
import { RegisterForm } from '@/features/auth/RegisterForm'

export default function RegisterScreen() {
  return (
   <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
        <AuthHeader
        title='Wecome to PJ1GIGBASE'
        subtitle=''
        />
        <RegisterForm/>
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
