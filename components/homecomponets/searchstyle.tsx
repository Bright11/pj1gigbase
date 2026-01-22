import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const searchstyle=StyleSheet.create({
    searchsection:{
        // backgroundColor:Colors.appcolor.begreen,
        width:"100%",
        padding:0,
        margin:0
    },
    searchcontainerview:{
        marginTop:40, 
        padding:20,
        borderRadius:9,
    },
    searchtext:{
        paddingHorizontal:10,
        borderRadius:8,
        fontSize:18,
        color:Colors.appcolor.text,
        fontFamily:'Poppins-extrabold',
        fontWeight:'700',
        textAlign:'center'
        
    },
    searchinputfomr:{
        flexDirection:"row",
        width:'100%',
        marginTop:20,
        alignItems:"center",
        backgroundColor:Colors.appcolor.promarycolor,
    },
    searchTextinput:{
        flexBasis:'90%',
        backgroundColor:Colors.appcolor.promarycolor,
        paddingHorizontal:10,
        paddingVertical:10,
        borderRadius:8,
        fontSize:18,
        color:Colors.appcolor.textblack,
        fontFamily:'Poppins-extrabold',
        
    },
    logoimage:{
        width:30,
        height:30,
        borderRadius:50
    },
    logo_container:{
        display:"flex",
        alignItems:"center",
        flexDirection:"row",
        gap:8,
        justifyContent:"center"
       
    }

})