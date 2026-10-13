import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { router, useNavigation } from 'expo-router';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { useAuthStore } from '@/store/auth.store';
import {
  updateProfile,
  UpdateProfileData,
} from '@/services/profile.service';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

const BIO_MAX_LENGTH = 500; // match your backend limit

/**
 * `value` is what gets sent to the API. Change these to match the choices
 * your backend accepts (e.g. 'M' / 'F').
 */
const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
] as const;

const DEFAULT_DOB = new Date(2000, 0, 1);

const COLORS = {
  screen: '#FAFAFA',
  card: '#FFFFFF',
  border: '#E5E7EB',
  cardBorder: '#F0F1F3',
  text: '#111827',
  label: '#4B5563',
  muted: '#6B7280', // readable on white (about 4.8:1)
  disabledBg: '#F3F4F6',
  errorBg: '#FDECEC',
  errorText: '#B42318',
} as const;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

type AuthUser = NonNullable<ReturnType<typeof useAuthStore.getState>['user']>;

interface FormState {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: string;
  country: string;
  city: string;
  bio: string;
}

function toForm(user: AuthUser | null): FormState {
  return {
    firstName: user?.profile.first_name ?? '',
    lastName: user?.profile.last_name ?? '',
    phoneNumber: user?.phone_number ?? '',
    dateOfBirth: user?.profile.date_of_birth ?? '',
    gender: user?.profile.gender ?? '',
    country: user?.profile.country ?? '',
    city: user?.profile.city ?? '',
    bio: user?.profile.bio ?? '',
  };
}

/** Local-time YYYY-MM-DD (toISOString would shift the day by timezone). */
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

function getErrorMessage(error: unknown): string {
  const fallback = 'Unable to update your profile.';
  if (!axios.isAxiosError(error)) return fallback;

  const data: unknown = error.response?.data;
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (typeof record.detail === 'string') return record.detail;

    // DRF field errors: { phone_number: ["Enter a valid phone number."] }
    const first = Object.values(record)[0];
    if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
    if (typeof first === 'string') return first;
  }
  return fallback;
}

/* -------------------------------------------------------------------------- */
/* Small components                                                            */
/* -------------------------------------------------------------------------- */

function LockedPill() {
  return (
    <View style={styles.lockedPill}>
      <Ionicons name="lock-closed" size={10} color={COLORS.muted} />
      <Text style={styles.lockedPillText}>Locked</Text>
    </View>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  locked?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

function Field({ label, locked, containerStyle, style, ...inputProps }: FieldProps) {
  return (
    <View style={[styles.fieldGroup, containerStyle]}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {locked && <LockedPill />}
      </View>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={COLORS.muted}
        {...inputProps}
        editable={!locked && inputProps.editable !== false}
        style={[styles.input, locked && styles.inputDisabled, style]}
      />
    </View>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Ionicons name={icon} size={16} color={COLORS.muted} />
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

interface DateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function DateField({ label, value, onChange, disabled }: DateFieldProps) {
  const [show, setShow] = useState(false);
  const date = parseISODate(value) ?? DEFAULT_DOB;

  const handleChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android shows a dialog: close it whatever the outcome.
    if (Platform.OS === 'android') setShow(false);
    if (event.type === 'set' && selected) onChange(toISODate(selected));
  };

  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, styles.labelSpaced]}>{label}</Text>

      <Pressable
        onPress={() => setShow(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value || 'not set'}`}
        style={[styles.input, styles.dateButton]}
      >
        <Text style={value ? styles.dateText : styles.datePlaceholder}>
          {value || 'Select date'}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={COLORS.muted} />
      </Pressable>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}

      {show && Platform.OS === 'ios' && (
        <Pressable
          onPress={() => setShow(false)}
          accessibilityRole="button"
          style={styles.doneButton}
        >
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

function GenderSelector({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={[styles.label, styles.labelSpaced]}>Gender</Text>

      <View style={styles.chipRow}>
        {GENDER_OPTIONS.map((option) => {
          const selected = value.toLowerCase() === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* Screen                                                                      */
/* -------------------------------------------------------------------------- */

export default function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const navigation = useNavigation();

  const initial = useMemo(() => toForm(user), [user]);
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Edit profile',
      headerStyle: { backgroundColor: Mycolors.primarycolor },
      headerTintColor: Mycolors.whitecolor, // back arrow + title
      headerShadowVisible: false,
    });
  }, [navigation]);

  if (!user) {
    return (
      <ProtectedRoute>
        <View style={styles.center}>
          <Text>Unable to load profile.</Text>
        </View>
      </ProtectedRoute>
    );
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const hasChanges = (Object.keys(form) as (keyof FormState)[]).some(
    (key) => form[key] !== initial[key],
  );

  const handleSave = async () => {
    if (saving || !hasChanges) return;

    try {
      setSaving(true);
      setError(null);

      const data: UpdateProfileData = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone_number: form.phoneNumber.trim(),
        date_of_birth: form.dateOfBirth.trim() || undefined,
        gender: form.gender.trim() || undefined,
        country: form.country.trim(),
        city: form.city.trim(),
        bio: form.bio.trim() || undefined,
      };

      await updateProfile(data);

      // Keep the auth store in sync so other screens show the new values.
      // If updateProfile returns the updated user, prefer: setUser(updated).
      setUser({
        ...user,
        phone_number: form.phoneNumber.trim(),
        profile: {
          ...user.profile,
          first_name: form.firstName.trim(),
          last_name: form.lastName.trim(),
          date_of_birth: form.dateOfBirth.trim(),
          gender: form.gender.trim(),
          country: form.country.trim(),
          city: form.city.trim(),
          bio: form.bio.trim(),
        },
      });

      router.back();
    } catch (err) {
      if (__DEV__) console.log('Profile update error:', err);
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const saveDisabled = saving || !hasChanges;

  return (
    <ProtectedRoute>
      {/* Header is visible, so only the bottom inset is needed (gesture bar). */}
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar style="light" />

        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            {error && (
              <View style={styles.errorBox} accessibilityRole="alert">
                <Ionicons name="alert-circle" size={16} color={COLORS.errorText} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <SectionHeader icon="shield-checkmark-outline" title="Account Information" />
            <View style={styles.card}>
              <Field
                label="Username"
                value={user.username ?? ''}
                locked
                autoCapitalize="none"
              />
              <Field
                label="Email"
                value={user.email ?? ''}
                locked
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <SectionHeader icon="person-outline" title="Personal Information" />
            <View style={styles.card}>
              <View style={styles.row}>
                <Field
                  label="First Name"
                  containerStyle={styles.half}
                  value={form.firstName}
                  onChangeText={(v) => update('firstName', v)}
                  editable={!saving}
                  autoComplete="given-name"
                />
                <Field
                  label="Last Name"
                  containerStyle={styles.half}
                  value={form.lastName}
                  onChangeText={(v) => update('lastName', v)}
                  editable={!saving}
                  autoComplete="family-name"
                />
              </View>

              <Field
                label="Phone Number"
                value={form.phoneNumber}
                onChangeText={(v) => update('phoneNumber', v)}
                keyboardType="phone-pad"
                editable={!saving}
                autoComplete="tel"
              />

              <DateField
                label="Date of Birth"
                value={form.dateOfBirth}
                onChange={(v) => update('dateOfBirth', v)}
                disabled={saving}
              />

              <GenderSelector
                value={form.gender}
                onChange={(v) => update('gender', v)}
                disabled={saving}
              />

              <View style={styles.row}>
                <Field
                  label="Country"
                  containerStyle={styles.half}
                  value={form.country}
                  onChangeText={(v) => update('country', v)}
                  editable={!saving}
                />
                <Field
                  label="City"
                  containerStyle={styles.half}
                  value={form.city}
                  onChangeText={(v) => update('city', v)}
                  editable={!saving}
                />
              </View>

              <Field
                label="Bio"
                value={form.bio}
                onChangeText={(v) => update('bio', v)}
                multiline
                maxLength={BIO_MAX_LENGTH}
                textAlignVertical="top"
                editable={!saving}
                placeholder="Tell others a bit about yourself"
                style={styles.bioInput}
              />
              <Text style={styles.counter}>
                {form.bio.length}/{BIO_MAX_LENGTH}
              </Text>
            </View>

            <Pressable
              onPress={handleSave}
              disabled={saveDisabled}
              accessibilityRole="button"
              accessibilityState={{ disabled: saveDisabled, busy: saving }}
              style={({ pressed }) => [
                styles.saveButton,
                saveDisabled && styles.disabledButton,
                pressed && !saveDisabled && styles.saveButtonPressed,
              ]}
            >
              {saving ? (
                <ActivityIndicator color={Mycolors.whitecolor} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={Mycolors.whitecolor}
                  />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.screen },
  container: { flex: 1, backgroundColor: COLORS.screen },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

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
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    padding: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },

  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  fieldGroup: { marginBottom: 16 },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.label,
  },
  labelSpaced: { marginBottom: 7 },

  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.disabledBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  lockedPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.muted,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.card,
  },
  inputDisabled: {
    backgroundColor: COLORS.disabledBg,
    color: COLORS.muted,
  },
  bioInput: { height: 110, paddingTop: 12 },
  counter: {
    alignSelf: 'flex-end',
    marginTop: -10,
    fontSize: 11,
    color: COLORS.muted,
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: { fontSize: 15, color: COLORS.text },
  datePlaceholder: { fontSize: 15, color: COLORS.muted },
  doneButton: { alignSelf: 'flex-end', paddingVertical: 8, paddingHorizontal: 4 },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: Mycolors.primarycolor,
  },

  chipRow: { flexDirection: 'row', gap: 10 },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
  },
  chipSelected: {
    backgroundColor: Mycolors.primarycolor,
    borderColor: Mycolors.primarycolor,
  },
  chipText: { fontSize: 14, fontWeight: '600', color: COLORS.label },
  chipTextSelected: { color: Mycolors.whitecolor },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    borderRadius: 14,
    backgroundColor: Mycolors.primarycolor,
    shadowColor: Mycolors.primarycolor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  saveButtonPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  disabledButton: { opacity: 0.5 },
  saveButtonText: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '700',
  },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.errorBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: { color: COLORS.errorText, fontSize: 13, flex: 1 },
});