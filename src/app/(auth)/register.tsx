import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '@/features/auth/AuthHeader';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { router, useNavigation } from 'expo-router';
import { Mycolors } from '@/constants/mycolors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: Mycolors.blackcolor,
      },
      headerLeft: () => (
        <Pressable
          style={[
            {
              backgroundColor: Mycolors.blackcolor,
              padding: 5,
            },
          ]}
          onPress={() => {
            Keyboard.dismiss();
            router.back();
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="white"
          />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
         <StatusBar style="auto" />
      <Pressable
        style={styles.dismissKeyboard}
        onPress={Keyboard.dismiss}
      >
        
          <AuthHeader
            title="Welcome to PJ1GIGBASE"
            subtitle=""
            newstyles={{
              color: Mycolors.whitecolor,
            }}
          />

          <RegisterForm />
    
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  dismissKeyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
});