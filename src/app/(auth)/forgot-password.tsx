import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import { Mycolors } from '@/constants/mycolors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WEBSITE_BASE_URL } from '@/services/api';

export default function ForgotPasswordScreen() {
      const navigation = useNavigation()

     useLayoutEffect(()=>{
        navigation.setOptions({
            headerShown: true,
            headerTitle:"",
             headerStyle:{
             backgroundColor: Mycolors.primarycolor,
             },
            headerLeft: () => (
      <Pressable
        onPress={() => router.push("/")}
        style={{
          marginLeft: 10,
          padding: 8,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
        />
      </Pressable>
    ),
      
        })
    })
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert(
        'Email Required',
        'Please enter your email address.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${WEBSITE_BASE_URL}/api/auth/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmedEmail,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            'Unable to process your request.',
        );
      }

      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, we have sent you a password reset link.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.replace('/(auth)/login');
            },
          },
        ],
      );
    } catch (error: any) {
      console.error(
        'Forgot password error:',
        error,
      );

      Alert.alert(
        'Request Failed',
        error?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Forgot Password?
      </Text>

      <Text style={styles.subtitle}>
        Enter the email address associated with
        your PJ1 GIGBASE account and we'll send
        you a password reset link.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#777"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleForgotPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() =>
          router.replace('/(auth)/login')
        }
        disabled={loading}
      >
        <Text style={styles.loginText}>
          Back to Login
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 12,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    height: 52,
    borderWidth: 0.5,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222222',
    marginBottom: 18,
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  loginButton: {
    alignItems: 'center',
    marginTop: 22,
  },

  loginText: {
    color: '#046307',
    fontSize: 15,
    fontWeight: '600',
  },
   topheader:{
        backgroundColor:Mycolors.whitecolor,
        paddingTop:6,
        paddingBottom:6,
        width:"100%"
      }
});