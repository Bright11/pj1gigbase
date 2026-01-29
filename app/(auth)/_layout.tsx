import { Stack } from 'expo-router';
import { Alert } from 'react-native';

export default function Authlayout() {
  const deleteaccount=async()=>{
    Alert.alert("Are you sure you want to delete your account?");

  }
  return (
    <Stack
    screenOptions={{
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#fff" },
        headerBackTitleStyle: { fontFamily: "Poppins-medium" },
      
  
    }}
    
    >
        
      <Stack.Screen name="signup"/>
    <Stack.Screen name="login"
    
    />
    <Stack.Screen name="Forgotpassword"/>
    </Stack>
  );
}
