import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Mycolors } from '@/constants/mycolors'

export default function ServiceScreen() {
   return (
      <View style={styles.container }> 
        <Text style={{color:Mycolors.whitecolor,  marginTop:67}}>Services</Text>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
      container:{
          flex:1,
          alignItems:'center',
          justifyContent:'center'
      }
  })