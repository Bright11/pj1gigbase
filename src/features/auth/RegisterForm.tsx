
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { register } from '@/services/auth.service';
import { Mycolors } from '@/constants/mycolors';



export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword:confirmPassword
      });

      console.log('Registration successful:', response);

      Alert.alert(
        'Account Created',
        'Your account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/login'),
          },
        ],
      );
    } catch (error: any) {
      console.log('Registration error:', error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.errors ||
        'Registration failed. Please try again.';

      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        editable={!loading}
        placeholderTextColor={Mycolors.whitecolor}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
        placeholderTextColor={Mycolors.whitecolor}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        placeholderTextColor={Mycolors.whitecolor}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
        placeholderTextColor={Mycolors.whitecolor}
      />

      <Pressable
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  input: {
   height: 52,
      borderWidth: 0.3,
      borderRadius: 10,
      paddingHorizontal: 16,
      marginBottom: 18,
      fontSize: 16,
      borderColor:Mycolors.graycolor,
      color:Mycolors.whitecolor
  },
  button: {
   height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.secondarycolor,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '700',
  },
});

