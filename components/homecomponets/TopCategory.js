// import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Pressable } from 'react-native';
//import { Categorydata } from '../textdata/categordata';
import { Colors } from '@/constants/Colors';
import  useCategoryData  from './firebasedata/ServicesCategory';


const TopCategory = (props) => {
    const categorydata = useCategoryData(); // Call the custom hook here
  
    const {getitembyId,setGetitemId,handlepress}=props;
    return (
    <View style={style.container}>
      <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
        data={categorydata}
        renderItem={({ item }) => (
          <Pressable onPress={() => handlepress(item.name)} style={style.categoritemview}>
           {/* Assuming 'name' is a property in your data */}
           <Image source={{uri:item?.image}} style={style.categoryimage}/>
           <Text style={style.catgoryname}>{item?.name}</Text> 
          </Pressable>
        )}
        
      />
    </View>
  );
};

const style=StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      marginTop:20
   
    },
    categoritemview:{
        marginLeft:10,
        marginBottom:10,
        padding:2,
        borderRadius:8,
        width:100,
        height:100,
        borderStyle:"solid",
        borderColor:Colors.appcolor.promarycolor,
        borderWidth:1,
        overflow:"hidden",
        alignItems:'center'
    },
    categoryimage:{
        width:95,
        height:80,
        resizeMode:'contain',
        objectFit:'cover',
        borderRadius:10
    },
    catgoryname:{
        fontFamily:"Poppins-MediumItalic",
        textAlign:'center',
        fontSize:12,
    }
})


export default TopCategory;
