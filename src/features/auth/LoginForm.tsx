import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Mycolors } from '@/constants/mycolors';

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');

    if (!username.trim()) {
      setError('Enter your username or email.');
      return;
    }

    if (!password) {
      setError('Enter your password.');
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        username: username.trim(),
        password,
      });

      setAuth(
        data.user,
        data.access,
        data.refresh
      );
      console.log(data)
      router.replace('/profile');
    } catch (err: any) {
    console.error('Login error:', err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to login. Please check your details and try again.';

      setError(
        typeof message === 'string'
          ? message
          : 'Unable to login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username or Email</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username or email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        editable={!loading}
        style={styles.input}
         placeholderTextColor={Mycolors.whitecolor}
      />

      <Text style={styles.label}>Password</Text>

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        secureTextEntry
        autoCapitalize="none"
        editable={!loading}
        style={styles.input}
        placeholderTextColor={Mycolors.whitecolor}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          loading && styles.buttonDisabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>

      <Pressable
        disabled={loading}
        onPress={() => router.push('/register')}
        style={styles.registerButton}
      >
        <Text style={styles.registerText}>
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
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

  error: {
    color: Mycolors.redcolor,
    marginBottom: 16,
    fontSize: 14,
    textAlign:"center"
  },

  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.secondarycolor,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '700',
  },

  registerButton: {
    alignItems: 'center',
    marginTop: 20,

  },

  registerText: {
    fontSize: 14,
    color:Mycolors.whitecolor,
  },
});