import { Mycolors } from "@/constants/mycolors";
import {StyleSheet, Text, View} from "react-native";

interface AuthHeaderProps {
    title:string;
    subtitle?:string;

}


export function AuthHeader({title,subtitle}:AuthHeaderProps){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginBottom:32
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