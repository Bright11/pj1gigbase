
import {
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
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

import {
  useLocalSearchParams,
  router,
  useNavigation,
} from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

import { getPublicTalentBySlug } from '@/services/talent.service';
import { createBooking } from '@/services/booking.service';

import type { PublicTalent } from '@/types/Talent';

import { Mycolors } from '@/constants/mycolors';

import BookingCalendar from '@/utils/BookingCalendar';
import { ProtectedRoute } from '@/utils/ProtectedRoute';

import { useAuthStore } from '@/store/auth.store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function BookingScreen() {
  const { talentId } = useLocalSearchParams();

  const navigation = useNavigation();

  const [talent, setTalent] = useState<PublicTalent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [venueAddress, setVenueAddress] = useState('');
  const [offeredRate, setOfferedRate] = useState('');

  const user = useAuthStore((state) => state.user);

  const [phoneNumber, setPhoneNumber] = useState(
    user?.phone_number ||
      user?.profile?.phone_number ||
      '',
  );

  /* =========================
     HEADER
  ========================= */

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,

      title: talent
        ? `Book ${talent.stage_name || talent.user_details?.username || 'Talent'}`
        : 'Book Talent',

      headerStyle: {
        backgroundColor: Mycolors.primarycolor,
      },

      headerTintColor: Mycolors.whitecolor,

      headerTitleStyle: {
        fontWeight: '700',
      },

      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color={Mycolors.whitecolor}
          />
        </TouchableOpacity>
      ),

      headerRight: () =>
        talent ? (
          <View style={styles.headerProfile}>
            {talent.userprofile?.profile_picture ? (
              <Image
                source={{
                  uri: talent.userprofile.profile_picture,
                }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("@/assets/images/default-profile.jpg")}
                style={styles.profileImage}
              />
            )}
          </View>
        ) : null,
    });
  }, [navigation, talent]);

  /* =========================
     LOAD TALENT
  ========================= */

  useEffect(() => {
    loadTalent();
  }, []);

  const loadTalent = async () => {
    try {
      setLoading(true);

      const data = await getPublicTalentBySlug(
        String(talentId),
      );

      setTalent(data);
    } catch (error) {
      console.log('Unable to load talent:', error);

      Alert.alert(
        'Unable to load',
        'Unable to load talent information.',
        [
          {
            text: 'Go Back',
            onPress: () => router.back(),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, '0');

    const day = String(
      date.getDate(),
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  /* =========================
     BOOKING
  ========================= */

  const handleBooking = async () => {
    if (!talent) return;

    Keyboard.dismiss();

    const clientPhone =
      user?.profile?.phone_number ||
      user?.phone_number ||
      phoneNumber.trim();

    if (!eventDate) {
      Alert.alert(
        'Event date required',
        'Please select the date of your event.',
      );
      return;
    }

    if (!venueAddress.trim()) {
      Alert.alert(
        'Location required',
        'Please enter the event location.',
      );
      return;
    }

    if (!clientPhone) {
      Alert.alert(
        'Phone number required',
        'Please enter your phone number.',
      );
      return;
    }

    if (
      talent.is_charges_enabled &&
      talent.is_price_negotiable &&
      !offeredRate.trim()
    ) {
      Alert.alert(
        'Offer required',
        'Please enter your offered price.',
      );
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        talent: talent.id,

        event_date: formatDateForApi(
          eventDate,
        ),

        venue_address:
          venueAddress.trim(),

        offered_rate:
          talent.is_charges_enabled &&
          talent.is_price_negotiable
            ? offeredRate.trim()
            : undefined,

        currency: talent.currency,

        phone_number: clientPhone,
      });

      Alert.alert(
        'Booking Request Sent',
        'Your booking request has been sent successfully. The talent will review your request.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error: any) {
      console.log(
        'Booking request error:',
        error?.response?.data || error,
      );

      const message =
        error?.response?.data?.detail ||
        'Unable to send booking request. Please try again.';

      Alert.alert(
        'Booking Failed',
        message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <ProtectedRoute>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Ionicons
              name="calendar-outline"
              size={30}
              color={Mycolors.secondarycolor}
            />
          </View>

          <ActivityIndicator
            size="small"
            color={Mycolors.secondarycolor}
          />

          <Text style={styles.loadingTitle}>
            Preparing booking
          </Text>

          <Text style={styles.loadingSubtitle}>
            Please wait while we prepare the booking page...
          </Text>
        </View>
      </ProtectedRoute>
    );
  }

  if (!talent) {
    return null;
  }


  return (
    <ProtectedRoute>
       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
           <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* =========================
              TALENT SUMMARY
          ========================= */}

          <View style={styles.talentCard}>
            {talent.userprofile?.profile_picture ? (
              <Image
                source={{
                  uri: talent.userprofile.profile_picture,
                }}
                style={styles.talentImage}
              />
            ) : (
              <Image
                source={require('../../../assets/images/profileicon.jpg')}
                style={styles.talentImage}
              />
            )}

            <View style={styles.talentInfo}>
              <Text style={styles.bookLabel}>
                Booking request for
              </Text>

              <Text
                style={styles.talentName}
                numberOfLines={1}
              >
                {talent.stage_name ||
                  talent.user_details?.username}
              </Text>

              {talent.title ? (
                <Text
                  style={styles.talentTitle}
                  numberOfLines={2}
                >
                  {talent.title}
                </Text>
              ) : null}
            </View>
          </View>

          {/* =========================
              DATE
          ========================= */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Event date
                </Text>

                <Text style={styles.sectionSubtitle}>
                  When do you need this talent?
                </Text>
              </View>
            </View>

            <BookingCalendar
              value={eventDate}
              onChange={setEventDate}
            />
          </View>

          {/* =========================
              LOCATION
          ========================= */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Event location
                </Text>

                <Text style={styles.sectionSubtitle}>
                  Where will the event take place?
                </Text>
              </View>
            </View>

            <TextInput
              style={[
                styles.input,
                styles.locationInput,
              ]}
              placeholder="Enter event location"
              placeholderTextColor="#999"
              value={venueAddress}
              onChangeText={setVenueAddress}
              editable={!submitting}
              multiline
            />
          </View>

          {/* =========================
              PRICE
          ========================= */}

          {talent.is_charges_enabled && (
            <View style={styles.priceCard}>

              <View style={styles.priceHeader}>
                <View style={styles.priceIcon}>
                  <Ionicons
                    name="cash-outline"
                    size={20}
                    color={Mycolors.secondarycolor}
                  />
                </View>

                <View>
                  <Text style={styles.priceTitle}>
                    Booking price
                  </Text>

                  <Text style={styles.priceSubtitle}>
                    Talent's current rate
                  </Text>
                </View>
              </View>

              <Text style={styles.price}>
                {talent.currency}{' '}
                {talent.fixed_rate ||
                  talent.hourly_rate}
              </Text>

              {talent.is_price_negotiable ? (
                <>
                  <View style={styles.negotiableBadge}>
                    <Ionicons
                      name="swap-horizontal-outline"
                      size={14}
                      color={Mycolors.greencolor}
                    />

                    <Text
                      style={
                        styles.negotiableText
                      }
                    >
                      Price is negotiable
                    </Text>
                  </View>

                  <Text style={styles.offerLabel}>
                    Your offer
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder={`Enter your offer in ${talent.currency}`}
                    placeholderTextColor="#999"
                    value={offeredRate}
                    onChangeText={setOfferedRate}
                    keyboardType="decimal-pad"
                    editable={!submitting}
                  />
                </>
              ) : (
                <View style={styles.fixedBadge}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={13}
                    color="#777"
                  />

                  <Text style={styles.fixedText}>
                    This price is fixed
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* =========================
              PHONE
          ========================= */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <View>
                <Text style={styles.sectionTitle}>
                  Phone number
                </Text>

                <Text style={styles.sectionSubtitle}>
                  The talent may use this to contact you.
                </Text>
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!submitting}
            />
          </View>

          {/* =========================
              INFO
          ========================= */}

          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={Mycolors.primarycolor}
            />

            <Text style={styles.infoText}>
              Your booking request will be sent to the
              talent for review. You will be notified when
              they accept or decline your request.
            </Text>
          </View>

          {/* =========================
              SUBMIT
          ========================= */}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              submitting &&
                styles.buttonDisabled,
            ]}
            onPress={handleBooking}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator
                size="small"
                color={Mycolors.primarycolor}
              />
            ) : (
              <>
                <Ionicons
                  name="paper-plane-outline"
                  size={19}
                  color={Mycolors.primarycolor}
                />

                <Text style={styles.buttonText}>
                  Send Booking Request
                </Text>
              </>
            )}
          </Pressable>

          <Text style={styles.bottomNote}>
            By sending this request, you are asking the
            talent to confirm your booking.
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 40,
    backgroundColor: Mycolors.whitecolor,
  },

  /* =========================
     TALENT
  ========================= */

  talentCard: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 14,

    marginBottom: 20,

    borderRadius: 16,

    backgroundColor: Mycolors.primarycolor,
  },

  talentImage: {
    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: '#ddd',
  },

  talentInfo: {
    flex: 1,
    marginLeft: 13,
  },

  bookLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    marginBottom: 3,
  },

  talentName: {
    color: Mycolors.whitecolor,
    fontSize: 17,
    fontWeight: '800',
  },

  talentTitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    marginTop: 4,
  },

  /* =========================
     SECTIONS
  ========================= */

  section: {
    marginBottom: 22,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 12,
  },

  sectionIcon: {
    width: 38,
    height: 38,

    borderRadius: 11,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,

    backgroundColor: '#FFF8E6',
  },

  sectionTitle: {
    color: Mycolors.primarycolor,
    fontSize: 15,
    fontWeight: '800',
  },

  sectionSubtitle: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },

  /* =========================
     INPUT
  ========================= */

  input: {
    minHeight: 52,

    borderWidth: 1,
    borderColor: '#E1E1E1',

    borderRadius: 12,

    paddingHorizontal: 15,

    fontSize: 15,

    color: Mycolors.primarycolor,

    backgroundColor: '#FAFAFA',
  },

  locationInput: {
    minHeight: 90,

    paddingTop: 14,

    textAlignVertical: 'top',
  },

  /* =========================
     PRICE
  ========================= */

  priceCard: {
    padding: 16,

    marginBottom: 22,

    borderRadius: 16,

    backgroundColor: '#F8F9FC',

    borderWidth: 1,
    borderColor: '#E8E9EF',
  },

  priceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  priceIcon: {
    width: 40,
    height: 40,

    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: 10,

    backgroundColor: Mycolors.primarycolor,
  },

  priceTitle: {
    color: Mycolors.primarycolor,
    fontSize: 15,
    fontWeight: '800',
  },

  priceSubtitle: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },

  price: {
    color: Mycolors.primarycolor,

    fontSize: 24,
    fontWeight: '900',

    marginTop: 15,
    marginBottom: 12,
  },

  negotiableBadge: {
    flexDirection: 'row',
    alignItems: 'center',

    alignSelf: 'flex-start',

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: '#EAF4E5',

    marginBottom: 14,
  },

  negotiableText: {
    color: Mycolors.greencolor,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 5,
  },

  offerLabel: {
    color: Mycolors.primarycolor,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },

  fixedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  fixedText: {
    color: '#777',
    fontSize: 12,
    marginLeft: 5,
  },

  /* =========================
     INFO
  ========================= */

  infoBox: {
    flexDirection: 'row',

    padding: 13,

    marginBottom: 18,

    borderRadius: 12,

    backgroundColor: '#F2F4F8',
  },

  infoText: {
    flex: 1,

    color: '#666',

    fontSize: 11,

    lineHeight: 17,

    marginLeft: 9,
  },

  /* =========================
     BUTTON
  ========================= */

  button: {
    minHeight: 54,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 14,

    backgroundColor: Mycolors.secondarycolor,

    paddingHorizontal: 20,

    elevation: 3,

    shadowColor: Mycolors.primarycolor,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: Mycolors.primarycolor,

    fontSize: 15,
    fontWeight: '900',

    marginLeft: 8,
  },

  bottomNote: {
    color: '#999',

    fontSize: 10,

    lineHeight: 16,

    textAlign: 'center',

    marginTop: 10,
  },

  /* =========================
     HEADER
  ========================= */

  headerButton: {
    paddingHorizontal: 8,
  },

  headerProfile: {
    paddingHorizontal: 10,
  },

  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,

    borderWidth: 1.5,
    borderColor: Mycolors.secondarycolor,
  },

  /* =========================
     LOADING
  ========================= */

  loadingContainer: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 30,

    backgroundColor: Mycolors.whitecolor,
  },

  loadingIcon: {
    width: 64,
    height: 64,

    borderRadius: 32,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: Mycolors.primarycolor,

    marginBottom: 18,
  },

  loadingTitle: {
    marginTop: 14,

    color: Mycolors.primarycolor,

    fontSize: 18,
    fontWeight: '800',
  },

  loadingSubtitle: {
    marginTop: 8,

    color: '#777',

    fontSize: 13,
    lineHeight: 20,

    textAlign: 'center',
  },
});
