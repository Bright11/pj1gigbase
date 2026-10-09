import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import { register } from '@/services/auth.service';
import { getUserCountryCode } from '@/services/country.service';
import { countries, Country } from '@/data/countries';
import { Mycolors } from '@/constants/mycolors';
import { getApiErrorMessage } from '@/services/api.error';

export function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('')

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [country, setCountry] = useState('');
  const [countryName, setCountryName] = useState('');
  const [detectedCountryCode, setDetectedCountryCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [countryLoading, setCountryLoading] = useState(true);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const detectedCountry = await getUserCountryCode();

        if (detectedCountry) {
          const exists = countries.some(
            item => item.code === detectedCountry,
          );

          if (exists) {
            setDetectedCountryCode(detectedCountry);
            setCountry(detectedCountry);

            const detectedCountryData = countries.find(
              item => item.code === detectedCountry,
            );

            setCountryName(detectedCountryData?.name || '');
          }
        }
      } catch (error) {
        console.log('Country detection failed:', error);
      } finally {
        setCountryLoading(false);
      }
    };

    detectCountry();
  }, []);

  const selectedCountry = countries.find(
    item => item.code === country,
  );

  const orderedCountries = useMemo(() => {
    if (!detectedCountryCode) {
      return countries;
    }

    const detectedCountry = countries.find(
      item => item.code === detectedCountryCode,
    );

    if (!detectedCountry) {
      return countries;
    }

    return [
      detectedCountry,
      ...countries.filter(
        item => item.code !== detectedCountryCode,
      ),
    ];
  }, [detectedCountryCode]);

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return orderedCountries;
    }

    return orderedCountries.filter(item =>
      item.name.toLowerCase().includes(query),
    );
  }, [search, orderedCountries]);

  const handleSelectCountry = (selected: Country) => {
    setCountry(selected.code);
    setCountryName(selected.name);
    setCountryModalVisible(false);
    setSearch('');
    Keyboard.dismiss();
  };

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (
      !username.trim() ||
      !email.trim() ||
      !country ||
      !password ||
      !confirmPassword ||
      !phonenumber
    ) {
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
        country,
        country_name: countryName,
        password,
        phone_number:phonenumber.trim(),
        confirmPassword,
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

      Alert.alert('Registration Failed',   getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Pressable
        style={styles.dismissArea}
        // onPress={Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>

            {/* Username */}
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor={Mycolors.whitecolor}
              returnKeyType="next"
            />

            {/* Email */}
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
              returnKeyType="next"
            />

            {/* Country */}
            <Pressable
              style={styles.input}
              onPress={() => {
                Keyboard.dismiss();
                setCountryModalVisible(true);
              }}
              disabled={loading || countryLoading}
            >
              {countryLoading ? (
                <View style={styles.countryRow}>
                  <ActivityIndicator
                    size="small"
                    color={Mycolors.whitecolor}
                  />

                  <Text style={styles.countryText}>
                    Detecting country...
                  </Text>
                </View>
              ) : selectedCountry ? (
                <View style={styles.countryRow}>
                  <Text style={styles.flag}>
                    {selectedCountry.flag}
                  </Text>

                  <View style={styles.countryInfo}>
                    <Text style={styles.countryText}>
                      {selectedCountry.name}
                    </Text>

                    {selectedCountry.code === detectedCountryCode && (
                      <Text style={styles.countryHint}>
                        Detected · Tap to change
                      </Text>
                    )}
                  </View>

                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Mycolors.graycolor}
                  />
                </View>
              ) : (
                <View style={styles.countryRow}>
                  <Text style={styles.placeholder}>
                    Select Country
                  </Text>

                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={Mycolors.graycolor}
                  />
                </View>
              )}
            </Pressable>

            {/* phone number */}
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={phonenumber}
              onChangeText={setPhonenumber}
              autoCapitalize="none"
              editable={!loading}
              placeholderTextColor={Mycolors.whitecolor}
              returnKeyType="next"
               keyboardType="numeric"
            />

            {/* Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                placeholderTextColor={Mycolors.whitecolor}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowPassword(prev => !prev)
                }
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

            {/* Confirm Password */}
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
                placeholderTextColor={Mycolors.whitecolor}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword(prev => !prev)
                }
                hitSlop={10}
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={22}
                  color={Mycolors.graycolor}
                />
              </Pressable>
            </View>

            {/* Register Button */}
            <Pressable
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color={Mycolors.primarycolor}
                />
              ) : (
                <Text style={styles.buttonText}>
                  Create Account
                </Text>
              )}
            </Pressable>

            {/* Login */}
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                router.push('/login');
              }}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginHighlight}>
                  Login
                </Text>
              </Text>
            </Pressable>

          </View>
        </ScrollView>
      </Pressable>

      {/* Country Modal */}
      <Modal
        visible={countryModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          Keyboard.dismiss();
          setCountryModalVisible(false);
          setSearch('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Country
              </Text>

              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setCountryModalVisible(false);
                  setSearch('');
                }}
              >
                <Text style={styles.closeButton}>
                  Close
                </Text>
              </Pressable>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Search country..."
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.code}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.countryItem}
                  onPress={() => handleSelectCountry(item)}
                >
                  <Text style={styles.itemFlag}>
                    {item.flag}
                  </Text>

                  <View style={styles.itemNameContainer}>
                    <Text style={styles.itemName}>
                      {item.name}
                    </Text>

                    {item.code === detectedCountryCode && (
                      <Text style={styles.suggestedText}>
                        Suggested
                      </Text>
                    )}
                  </View>

                  {item.code === country && (
                    <Text style={styles.selectedMark}>
                      ✓
                    </Text>
                  )}
                </Pressable>
              )}
            />

          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  dismissArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  container: {
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  input: {
    height: 52,
    borderWidth: 0.3,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 4,
    fontSize: 16,
    borderColor: Mycolors.blackcolor,
    color: Mycolors.whitecolor,
    backgroundColor: Mycolors.blackcolor,
    justifyContent: 'center',
  },

  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  flag: {
    fontSize: 22,
  },

  countryInfo: {
    flex: 1,
  },

  countryText: {
    color: Mycolors.whitecolor,
    fontSize: 16,
  },

  countryHint: {
    fontSize: 11,
    marginTop: 2,
    color: Mycolors.graycolor,
  },

  placeholder: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    flex: 1,
  },

  /* Password */

  passwordContainer: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Mycolors.blackcolor,
    borderWidth: 0.3,
    borderColor: Mycolors.blackcolor,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    paddingRight: 5,
    color: Mycolors.whitecolor,
    fontSize: 16,
  },

  eyeButton: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Button */

  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.secondarycolor,
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Login */

  loginLink: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },

  loginText: {
    color: Mycolors.blackcolor,
    fontSize: 14,
  },

  loginHighlight: {
    color: Mycolors.secondarycolor,
    fontWeight: '700',
  },

  /* Country Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    height: '80%',
    backgroundColor: Mycolors.whitecolor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Mycolors.blackcolor,
  },

  closeButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Mycolors.secondarycolor,
  },

  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
    color: Mycolors.blackcolor,
  },

  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },

  itemFlag: {
    fontSize: 24,
    width: 40,
  },

  itemNameContainer: {
    flex: 1,
  },

  itemName: {
    fontSize: 16,
    color: Mycolors.blackcolor,
  },

  suggestedText: {
    fontSize: 11,
    marginTop: 2,
    color: Mycolors.secondarycolor,
    fontWeight: '600',
  },

  selectedMark: {
    fontSize: 20,
    fontWeight: '700',
    color: Mycolors.secondarycolor,
  },
});