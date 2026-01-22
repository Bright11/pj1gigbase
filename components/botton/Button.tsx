import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';

const Button = (props) => {
    const { text, onPress, mystyle: customStyle } = props;
   
  return (
    <Pressable onPress={onPress} style={[style.signupbutton,customStyle]}>
        <Text style={style.signupbuttonText}>{text}</Text></Pressable>
  )
}

export default Button

const style = StyleSheet.create({
    signupbutton: {
        backgroundColor:Colors.appcolor.promarycolor,
        borderRadius: 20,
        padding: 10,
        margin: 10,
        elevation: 3,
        width: '90%',
        alignSelf: 'center',
        marginTop:10
    },
    signupbuttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        textAlign: 'center',
        fontFamily:'Poppins-extrabold',
    },
})