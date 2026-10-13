import { Mycolors } from "@/constants/mycolors";
import {StyleProp, StyleSheet, Text, TextStyle, View} from "react-native";

interface AuthHeaderProps {
    title:string;
    subtitle?:string;
   newstyles?: StyleProp<TextStyle>; 

}


export function AuthHeader({title,subtitle,newstyles}:AuthHeaderProps){
    return(
        <View style={styles.container}>
            <Text style={[styles.title,newstyles]}>{title}</Text>
            {subtitle && <Text style={[styles.subtitle,newstyles]}>{subtitle}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginBottom:12,
        marginLeft:20
    },
    title:{
        fontSize:30,
        fontWeight:"700",
        marginBottom:8,
        color:Mycolors.whitecolor
    },
    subtitle:{
        fontSize:15,
        lineHeight:24,
        opacity:0.65,
        color:Mycolors.graycolor
    }
})