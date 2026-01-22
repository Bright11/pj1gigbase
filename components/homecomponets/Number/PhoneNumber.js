import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import { Feather } from '@expo/vector-icons'

const PhoneNumber = ({mynumber,btncolor}) => {
    

    const makePhoneCall = () => {
        Linking.openURL(`tel:${mynumber}`).catch((err) => console.error('Error making phone call', err));
      };
      
  return (
  
    <TouchableOpacity style={[style.signupbutton,btncolor]} onPress={makePhoneCall}>
            <Feather name="phone-call" size={24} color="white" />
            <Text style={style.signupbuttonText}>{mynumber}</Text>
            </TouchableOpacity>  
    
  )
}
const style=StyleSheet.create({
    signupbutton: {
        backgroundColor:Colors.appcolor.promarycolor,
        borderRadius: 20,
        padding: 4,
        margin: 10,
        elevation: 3,
        width: '90%',
        alignSelf: 'center',
        marginTop:10,
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        gap:12,
       
    },
    signupbuttonText: {
        color: 'white',
      
        fontSize: 20,
        textAlign: 'center',
        fontFamily:'Poppins-extrabold',
        fontWeight:'700',
    },
})
export default PhoneNumber