import { View, Text, KeyboardAvoidingView,TextInput, StyleSheet, Image, Pressable, Alert, Platform } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'

import { Link, router, useNavigation } from 'expo-router'
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Button from '@/components/botton/Button';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '@/components/firebase/Firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native';
import { ScrollView } from 'react-native';





export default function Signup() {
    const navigation=useNavigation();

   useLayoutEffect(()=>{
    navigation.setOptions({
        title: "",
    headerTitleAlign: 'center',
   
    headerRight:()=>(
       <View style={style.titletopview}>
           <Text style={style.titletoptext}>Sign Up</Text>
       </View>
    ),
    
    })
   },[navigation])
   
    const [chosedata, setChosedata]=useState(false)
   
    const[name,setName]=useState("")
    const[email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[number,setNumber]=useState("")
    const[servicetype,setServicetype]=useState("")
    const[progress,setProgress]=useState(false)

    const choseservice=()=>{
        setChosedata(!chosedata)
        
    }
    const imcforlient=()=>{
        setServicetype("Client");
        setChosedata(!chosedata)
    }
    const imforservice=()=>{
        setServicetype("Performer");
        setChosedata(!chosedata)
    }
    const register = async () => {
        // Validate input fields
        if (!name || !email || !password || !number || !servicetype) {
            Alert.alert("Please fill in all fields");
            return;
        }
    setProgress(true)
        try {
            // Create a user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Prepare user data with an empty user profile
            const userData = {
                username: name,
                pnumber: number,
                userId: user.uid,
                email: email,
                servicetype: servicetype,
                userprofile: "", // Keeping this empty as per your current requirement
                expoPushToken:"",
                isloggedin:false,
            };
    
            // Save user data to Firestore using the user.uid as the document ID
            await setDoc(doc(db, "users", user.uid), userData);
    
            // Save user data to AsyncStorage in parallel
            await AsyncStorage.multiSet([
                ["islogedin", JSON.stringify(true)],
                ["username", name],
                ["userId", user.uid],
                ["pnumber", number],
                ["email", email],
                ["servicetype", servicetype],
                ["userprofile", ""] // Matching the empty userprofile value
            ]);
    
            console.log(user.uid);
    
            // Redirect to Home screen (uncomment if using)
            router.replace("/(tabs)/Home");
    
        } catch (error) {
            Alert.alert("Registration Error", "An error occurred during registration");
            setProgress(false)
        }
    };
    
      

  return (
    <SafeAreaView style={style.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={style.logoview}>
          <Image style={style.logoimage} source={require("../../assets/images/pjlogo.jpeg")} />
        </View>
           <Text style={{textAlign:"center"}}>Enter your information</Text>
           <TextInput style={style.input}  
             placeholder='Your full name'
            onChangeText={(name)=>setName(name)}
           />
           <TextInput style={style.input}  autoComplete='none'
           keyboardType='email-address'
             placeholder='Enter your Email'
             onChangeText={(email)=>setEmail(email)}
           />
           <TextInput  style={style.input}  autoComplete='none'
           secureTextEntry={true}
           placeholder='Enter your password'
           onChangeText={(password)=>setPassword(password)}
           />
         
           <TextInput   style={style.input}   keyboardType='phone-pad' placeholder='Enter your phone number' autoComplete='none'
           onChangeText={(number)=>setNumber(number)}
           />
     <View style={style.chosecontainer}>
      <Pressable style={style.choseiconsview} onPress={choseservice}>
      <TextInput style={style.input} placeholder='Chose service option' value={servicetype}  readOnly
      onChangeText={(servicetype)=>setServicetype(servicetype)}
      />
      <MaterialIcons name="arrow-drop-down" size={30} color="black" />
      </Pressable>
      {chosedata?
       <View style={style.optionstochose}>
       <Pressable style={style.options} onPress={imcforlient}>
           <Text style={style.optionsText}>Client</Text>
       </Pressable >
       <Pressable style={style.options} onPress={imforservice}>
    
           <Text style={style.optionsText}>Performer</Text>
           </Pressable>
   </View>
      :""}
      
       </View>
    {!progress&&
      <Button onPress={register} text="Register"/>
    }
       <Pressable onPress={()=>router.push("./login")} style={{color:Colors.appcolor.promarycolor}}>
           <Text style={{textAlign:"center",marginTop:8}}>Already have an account? </Text>
       </Pressable>
        </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
  )

}
const  style=StyleSheet.create({
  container: {
    flex: 1, // Add this
    width:"100%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    paddingHorizontal:16,
    paddingVertical:16,
    borderRadius:10,
    backgroundColor:"#f8f9fa",
    elevation:5,
    // Remove marginBottom:100 and paddingBottom:100
},
      input: {
        width: "90%", 
        fontFamily: 'Poppins-extrabold', 
        fontWeight: '700', 
        fontSize: 18,
        borderWidth:1,
        padding: 8, 
        marginTop: 5,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignSelf:"center",
        marginBottom:30
      },
    
      logoview:{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        marginBottom:20,
        paddingVertical:1,
        paddingHorizontal:1,
        backgroundColor:Colors.appcolor.promarycolor,
        borderRadius:50,
        marginTop:20,
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginLeft:"auto",
        marginRight:"auto",
        
       
      },
      logoimage:{
        width:100,
        height:100,
      
        justifyContent:"center",
        borderRadius:50
      },
      chosecontainer:{
        position:"relative"
      },
      optionstochose:{
        position:"absolute",
        top:40,
        flexDirection:"row",
        justifyContent:"space-around",
        zIndex:120
      },
      options:{
        paddingTop:5,
        paddingBottom:5,
        paddingRight:10,
        paddingLeft:10,
        backgroundColor:Colors.appcolor.promarycolor,
        marginRight:15,
        
      },
      optionsText:{
        color:Colors.appcolor.textblack,
        fontWeight:"700",
        fontSize:18
      },
      choseiconsview:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:10
      },
      titletopview:{
        justifyContent: 'center',  // Center vertically
        alignItems: 'center',      // Center horizontally         // Ensure it takes full height of the header  
        backgroundColor:Colors.appcolor.promarycolor,
        width:"80%",
        height:"100%",
        padding:10,
        borderRadius:10,
        elevation:5,
        marginLeft:"auto",
        paddingRight: 0,  // Remove padding/margin from the right container
        marginRight: "auto",

    },
    titletoptext:{
        fontFamily:"Poppins-extrabold",
        fontSize:16
    }
  });