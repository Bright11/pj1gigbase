import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clearStoredTokens, deleteAccount } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function DeleteAccountScreen() {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const { clearAuth } = useAuthStore();

  const handleDeleteAccount = () => {
    if (!password.trim()) {
      Alert.alert(
        'Password required',
        'Please enter your current password.'
      );
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? Your profile, talents, photos, and videos will be deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ]
    );
  };

const confirmDeleteAccount = async () => {
  try {
    setIsDeleting(true);

    await deleteAccount(password);

    // Clear local authentication/session
    await clearStoredTokens();
    clearAuth();

    // Send the user to the login screen
    router.replace('/login');
  } catch (error) {
    console.error('Delete account error:', error);

    Alert.alert(
      'Unable to delete account',
      'We could not delete your account. Please check your password and try again.'
    );
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <ProtectedRoute>
       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
           <StatusBar style="auto" />
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="trash-outline"
            size={34}
            color="#dc2626"
          />
        </View>

        <Text style={styles.title}>
          Delete your account
        </Text>

        <Text style={styles.description}>
          This action is permanent. Your PJ1 GIGBASE
          account, profile, talents, photos, and videos
          will be deleted.
        </Text>

        <Text style={styles.warning}>
          This action cannot be undone.
        </Text>

        <Text style={styles.label}>
          Current password
        </Text>

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your current password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isDeleting}
        />

        <Pressable
          style={[
            styles.deleteButton,
            isDeleting && styles.disabledButton,
          ]}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Ionicons
                name="trash-outline"
                size={20}
                color="#ffffff"
              />

              <Text style={styles.deleteButtonText}>
                Delete My Account
              </Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isDeleting}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 10,
  },

  warning: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#111827',
    marginBottom: 20,
  },

  deleteButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});
