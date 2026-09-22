import { DarkTheme, DefaultTheme, ThemeProvider,Stack, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { restoreSession } from '@/services/auth.session';
import { useEffect } from 'react';
import { setupNotificationListeners } from '@/services/notification.service';



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // useEffect(()=>{
  //   restoreSession()
  //   const cleanup= setupNotificationListeners()
  //   return cleanup;
  // },[])
  useEffect(() => {
  console.log('ROOT LAYOUT MOUNTED');

  restoreSession();

  console.log('SETTING UP NOTIFICATION LISTENERS');

  const cleanup = setupNotificationListeners();

  return () => {
    console.log('CLEANING UP NOTIFICATION LISTENERS');
    cleanup();
  };
}, []);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>        
        {/*  <Stack initialRouteName="(tabs)">  */}
         {/* <Stack.Screen name="home" options={{ headerShown: false }} /> */}
          <Stack.Screen name='(tabs)'  options={{headerShown:false}}/>
        <Stack.Screen name='(auth)'  options={{headerShown:false}}/>
        <Stack.Screen name='post-talent' options={{headerShown:false}}/>
        <Stack.Screen name='my-talents' options={{headerShown:false}}/>
        <Stack.Screen name='manage-talent/[id]' options={{headerShown:false}}/>
        <Stack.Screen name='talentdetails/[slug]' options={{headerShown:false}}/>
        <Stack.Screen name='chat/[conversationId]' options={{headerShown:false}}/>
        <Stack.Screen name='chat/inbox' options={{headerShown:false}}/>
        <Stack.Screen name='booking/[talentId]' options={{headerShown:false}}/>
        <Stack.Screen name='booking/bookingrequest' options={{headerShown:false}}/>
        <Stack.Screen name='booking/my-bookings' options={{headerShown:false}}/>
        {/* <Stack.Screen name='auth/login' options={{headerShown:false}}/> */}




      </Stack>
    </ThemeProvider>
  );
}





