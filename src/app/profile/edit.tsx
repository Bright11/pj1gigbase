import React, { useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useNavigation } from 'expo-router';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { useAuthStore } from '@/store/auth.store';
import {
  updateProfile,
  UpdateProfileData,
} from '@/services/profile.service';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigation = useNavigation();

useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerTitle: "",
    headerStyle: {
      backgroundColor: Mycolors.primarycolor,
    },
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.goBack()}
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
    headerRight:()=>(
      <Text style={[styles.title,{color:Mycolors.whitecolor}]}>Edit profie</Text>
    )
  });
}, [navigation]);


  const [firstName, setFirstName] = useState(user?.profile.first_name ?? '');
  const [lastName, setLastName] = useState(user?.profile.last_name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phoneNumber, setPhoneNumber] = useState(user?.profile.phone_number ?? '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.profile.date_of_birth ?? '');
  const [gender, setGender] = useState(user?.profile.gender ?? '');
  const [country, setCountry] = useState(user?.profile.country ?? '');
  const [city, setCity] = useState(user?.profile.city ?? '');
  const [bio, setBio] = useState(user?.profile.bio ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <ProtectedRoute>
        <View style={styles.center}>
          <Text>Unable to load profile.</Text>
        </View>
      </ProtectedRoute>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const data: UpdateProfileData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone_number: phoneNumber.trim(),
        date_of_birth: dateOfBirth.trim() || undefined,
        gender: gender.trim() || undefined,
        country: country.trim(),
        city: city.trim(),
        bio: bio.trim() || undefined,
      };

      await updateProfile(data);

      router.back();
    } catch (error: any) {
      console.log('Profile update error:', error?.response?.data || error);

      setError(
        error?.response?.data?.detail || 'Unable to update your profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={20} color="#111827" />
            </Pressable>

            <Text style={styles.title}>Edit Profile</Text>

            <View style={styles.headerSpacer} />
          </View> */}

          {error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color="#B42318" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Account Information */}
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Account Information</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.lockedPill}>
                  <Ionicons name="lock-closed" size={10} color="#9CA3AF" />
                  <Text style={styles.lockedPillText}>Locked</Text>
                </View>
              </View>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={false}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.lockedPill}>
                  <Ionicons name="lock-closed" size={10} color="#9CA3AF" />
                  <Text style={styles.lockedPillText}>Locked</Text>
                </View>
              </View>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="person-outline" size={16} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Personal Information</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!saving}
                />
              </View>

              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!saving}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                editable={!saving}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#B0B4BB"
                  editable={!saving}
                />
              </View>

              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={gender}
                  onChangeText={setGender}
                  editable={!saving}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  value={country}
                  onChangeText={setCountry}
                  editable={!saving}
                />
              </View>

              <View style={[styles.fieldGroup, styles.half]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  editable={!saving}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                multiline
                textAlignVertical="top"
                editable={!saving}
                placeholder="Tell others a bit about yourself"
                placeholderTextColor="#B0B4BB"
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              saving && styles.disabledButton,
              pressed && !saving && styles.saveButtonPressed,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 48,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop:50
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F1F3',
    padding: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 7,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  lockedPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#F9FAFB',
    color: '#9CA3AF',
  },

  bioInput: {
    height: 110,
    paddingTop: 12,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    backgroundColor: Mycolors.primarycolor ?? '#007AFF',
    shadowColor: Mycolors.primarycolor ?? '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabledButton: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#B42318',
    fontSize: 13,
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
     topheader:{
      backgroundColor:Mycolors.whitecolor,
      paddingTop:6,
      paddingBottom:6,
      width:"100%"
    },
});