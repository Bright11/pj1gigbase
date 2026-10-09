import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { resetPassword } from '@/services/auth.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Mycolors } from '@/constants/mycolors';

export default function ResetPasswordScreen() {
    const navigation = useNavigation()

     useLayoutEffect(()=>{
        navigation.setOptions({
            title:"",
             headerShown: true,
             
             headerLeft:()=>(
                <View style={styles.topheader}>
                  <TouchableOpacity  
          // onPress={() => navigation.goBack()} 
          onPress={()=> router.push('/forgot-password')}
          style={[{ paddingHorizontal: 10, }]}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
                </View>
             ),
      
        })
    })
  const { uid, token } = useLocalSearchParams<{
    uid?: string;
    token?: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

 
  const handleResetPassword = async () => {
  if (!uid || !token) {
    Alert.alert(
      'Invalid Link',
      'This password reset link is invalid or incomplete.'
    );
    return;
  }

  if (!password || !confirmPassword) {
    Alert.alert(
      'Required Fields',
      'Please enter your new password and confirm it.'
    );
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert(
      'Passwords Do Not Match',
      'Please make sure both passwords are the same.'
    );
    return;
  }

  try {
    setLoading(true);

    await resetPassword(
      String(uid),
      String(token),
      password,
    );

    Alert.alert(
      'Password Reset Successful',
      'Your password has been changed successfully.',
      [
        {
          text: 'Go to Login',
          onPress: () => {
            router.replace('/(auth)/login');
          },
        },
      ],
    );

  } catch (error: any) {
    console.error(
      'Reset password error:',
      error
    );

    const message =
      error?.response?.data?.detail ||
      'Unable to reset your password. The link may have expired or is invalid.';

    Alert.alert(
      'Password Reset Failed',
      message,
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Reset Your Password
      </Text>

      <Text style={styles.subtitle}>
        Create a new password for your PJ1 GIGBASE account.
      </Text>

      {/* New Password */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#777"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          <Text style={styles.eyeText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>

      </View>


      {/* Confirm Password */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() =>
            setShowConfirmPassword(
              !showConfirmPassword
            )
          }
        >
          <Text style={styles.eyeText}>
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>

      </View>


      {/* Reset Button */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleResetPassword}
        disabled={loading}
      >

        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>
            Reset Password
          </Text>
        )}

      </TouchableOpacity>


      {/* Back to Login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.replace('/(auth)/login')}
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
    marginBottom: 10,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 30,
  },

  inputContainer: {
    height: 52,
    borderWidth: 0.5,
    borderColor: '#cccccc',
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#222222',
  },

  eyeButton: {
    paddingHorizontal: 5,
  },

  eyeText: {
    color: '#046307',
    fontSize: 14,
    fontWeight: '600',
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#046307',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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