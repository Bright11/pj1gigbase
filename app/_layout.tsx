import React from 'react';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import {
  ActivityIndicator,
  View,
} from 'react-native';

export default function RootLayout() {
  // Load fonts
  const [fontsLoaded] = useFonts({
    'Poppins-bold': require('./../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-extrabold': require('./../assets/fonts/Poppins-ExtraBold.ttf'),
    'Poppins-medium': require('./../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-MediumItalic': require('./../assets/fonts/Poppins-MediumItalic.ttf'),
  });

  // If fonts are not loaded, return a loading indicator
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Once fonts are loaded, return the Stack navigator
  return (
    <Stack >
      <Stack.Screen name="index" 
      options={{
        title:"Home"
      }}
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false ,
        }} 
      />

      <Stack.Screen 
        name="(auth)" 
        options={{ headerShown: false }} 
      />
         {/* <Stack.Screen name="(hidden)" options={{ presentation: "modal" }} /> */}
    </Stack>
  );
}
