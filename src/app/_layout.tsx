import { DarkTheme, DefaultTheme, ThemeProvider,Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { restoreSession } from '@/services/auth.session';
import { useEffect } from 'react';



SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(()=>{
    restoreSession()
  },[])
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
     
      <Stack>
         {/* <Stack.Screen name="home" options={{ headerShown: false }} /> */}
          <Stack.Screen name='(tabs)'  options={{headerShown:false}}/>
        <Stack.Screen name='(auth)'  options={{headerShown:false}}/>
        <Stack.Screen name='post-talent' options={{headerShown:false}}/>
        <Stack.Screen name='my-talents' options={{headerShown:false}}/>
        <Stack.Screen name='manage-talent/[id]' options={{headerShown:false}}/>


       
        
       

        {/* <Stack.Screen name='(auth)' options={{ headerShown: false }} /> */}
        
      </Stack>
    </ThemeProvider>
  );
}


