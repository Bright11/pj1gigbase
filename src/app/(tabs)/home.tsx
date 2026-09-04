import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Mycolors } from '@/constants/mycolors'

import Category from '@/features/talents/Category'


export default function home() {
  return (
    <SafeAreaView style={{backgroundColor:"white",flex:1}}>
      <StatusBar backgroundColor={Mycolors.primarycolor}/>
     <Category/>

    </SafeAreaView>
  )
}