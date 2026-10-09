import React, { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { login } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { Mycolors } from '@/constants/mycolors';

export function LoginForm() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username or email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);

      const data = await login({
        username: username.trim(),
        password,
      });

      setAuth(data.user, data.access, data.refresh);

      router.replace('/');
    } catch (err: any) {
      console.error('Login error:', err);

      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to login. Please check your details and try again.';

      setError(
        typeof message === 'string'
          ? message
          : 'Unable to login. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={styles.screen}
      onPress={Keyboard.dismiss}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        {/* Intro */}
        <View style={styles.intro}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>PJ1</Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>

          <Text style={styles.subtitle}>
            Sign in to continue to your PJ1 GIGBASE account
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formCard}>
          {/* Username */}
          <View style={styles.field}>
            <Text style={styles.label}>Username or Email</Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Mycolors.graycolor}
                style={styles.inputIcon}
              />

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username or email"
                placeholderTextColor={Mycolors.graycolor}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!loading}
                style={styles.input}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.field}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>

              <Pressable
                onPress={() => router.push('/forgot-password')}
                disabled={loading}
              >
                <Text style={styles.forgotText}>
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Mycolors.graycolor}
                style={styles.inputIcon}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={Mycolors.graycolor}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowPassword((previous) => !previous)
                }
                disabled={loading}
                style={styles.eyeButton}
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={22}
                  color={Mycolors.graycolor}
                />
              </Pressable>
            </View>
          </View>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={Mycolors.redcolor}
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Login */}
          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && !loading && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color={Mycolors.primarycolor}
              />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  Sign In
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={Mycolors.primarycolor}
                />
              </>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              OR
            </Text>

            <View style={styles.divider} />
          </View>

          {/* Register */}
          <View style={styles.registerSection}>
            <Text style={styles.registerLabel}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                router.push('/register');
              }}
              disabled={loading}
            >
              <Text style={styles.registerLink}>
                Create an account
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to PJ1 GIGBASE's terms
          and conditions.
        </Text>
      </ScrollView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 35,
  },

  /* ---------------- INTRO ---------------- */

  intro: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  logoText: {
    color: Mycolors.secondarycolor,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: '800',
    color: Mycolors.primarycolor,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    maxWidth: 310,
    fontSize: 14,
    lineHeight: 21,
    color: '#666666',
    textAlign: 'center',
  },

  /* ---------------- CARD ---------------- */

  formCard: {
    width: '100%',
    backgroundColor: Mycolors.whitecolor,
    borderRadius: 18,
    padding: 20,

    shadowColor: Mycolors.blackcolor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,

    elevation: 4,
  },

  /* ---------------- FIELDS ---------------- */

  field: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Mycolors.primarycolor,
    marginBottom: 8,
  },

  passwordLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: Mycolors.primarycolor,
  },

  inputContainer: {
    height: 54,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 12,
    backgroundColor: '#FAFAFA',

    flexDirection: 'row',
    alignItems: 'center',
  },

  inputIcon: {
    marginLeft: 15,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    color: Mycolors.blackcolor,
    fontSize: 15,
  },

  eyeButton: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---------------- ERROR ---------------- */

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF2F2',
    borderRadius: 10,

    paddingHorizontal: 12,
    paddingVertical: 11,

    marginBottom: 18,
  },

  errorText: {
    flex: 1,
    marginLeft: 8,
    color: Mycolors.redcolor,
    fontSize: 13,
    lineHeight: 18,
  },

  /* ---------------- BUTTON ---------------- */

  loginButton: {
    height: 54,
    borderRadius: 12,

    backgroundColor: Mycolors.secondarycolor,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 9,
  },

  loginButtonText: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '800',
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  /* ---------------- DIVIDER ---------------- */

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },

  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: Mycolors.graycolor,
  },

  /* ---------------- REGISTER ---------------- */

  registerSection: {
    alignItems: 'center',
  },

  registerLabel: {
    color: '#777777',
    fontSize: 13,
    marginBottom: 5,
  },

  registerLink: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '800',
  },

  /* ---------------- FOOTER ---------------- */

  footerText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 22,
    paddingHorizontal: 25,
  },
});
