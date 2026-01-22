import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { ghanadata } from '@/components/textdata/regions'
import { Link, router, useNavigation } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'

const Myregion = ({setRegion,setOpenregion}) => {
    const navigation=useNavigation();
    useLayoutEffect(()=>{
        navigation.setOptions({
          title:"Select Your Region",
          headerTitleAlign: 'center',
          
          headerLeft:()=>(
            <TouchableOpacity onPress={()=>  setOpenregion(false)} style={{marginLeft:8}}>
           <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          )
        })
      
    },[navigation])

  
    const getregion=(region)=>{
        setRegion(region)
        setOpenregion(false)
    }
  return (
    <View style={styles.container}>
     
    <ScrollView>
      {ghanadata.map((item) => (
       
        <TouchableOpacity
          style={styles.selectoptions}
         onPress={()=>getregion(item.region_name)}
         key={item.id}
        >
         
         <Text>{item.region_name}</Text>
        
        </TouchableOpacity>
      
      ))}
    </ScrollView>
 
</View>
  )
}

export default Myregion

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignContent:"center",
         width:"100%",
        paddingHorizontal:10,
        backgroundColor:"#ffffff",
        borderWidth:1,
        borderColor:"#cccccc",
        borderRadius:5,
    },
   
    selectoptions:{
        padding:10,
        borderBottomWidth:1,
        borderBottomColor:"#cccccc",
        alignItems:"center",
        marginBottom:10
    }
})