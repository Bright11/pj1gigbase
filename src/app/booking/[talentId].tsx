import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';

import { getPublicTalentBySlug } from '@/services/talent.service';
import { createBooking } from '@/services/booking.service';
import type { PublicTalent } from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import Ionicons from '@expo/vector-icons/Ionicons';
import BookingCalendar from '@/utils/BookingCalendar';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { useAuthStore } from '@/store/auth.store';

export default function BookingScreen() {
  const { talentId } = useLocalSearchParams();

  const [talent, setTalent] = useState<PublicTalent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

//   const [eventDate, setEventDate] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [offeredRate, setOfferedRate] = useState('');
   const navigation = useNavigation();

const [eventDate, setEventDate] = useState<Date | null>(null);

const [phoneNumber, setPhoneNumber] = useState('');

 const user = useAuthStore(
  (state) => state.user
);



  useLayoutEffect(() => {
    navigation.setOptions({
      // Fix syntax and add placeholder while talent is loading
      title: talent ? `Book ${talent.stage_name}` : 'Loading...',
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ paddingHorizontal: 10,backgroundColor:Mycolors.primarycolor }}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 15, paddingHorizontal: 10, backgroundColor:Mycolors.primarycolor }}>
          <TouchableOpacity onPress={() => console.log('Search pressed')}>
            {/* <Ionicons name="search" size={24} color="#333" /> */}
            {/* <Text>{talent? `${talent?.userprofile?.profile_picture}`:null}</Text> */}
            
            {talent?.userprofile?.profile_picture ? (
            <Image
                style={styles.profilimage}
                source={{ uri: talent.userprofile.profile_picture }}
            />
            ) : (
            <Image
                style={styles.profilimage}
                source={require('../../../assets/images/profileicon.jpg')}
             
            />
            )}
            
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => console.log('Settings pressed')}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity> */}
        </View>
      ),
    });
  }, [navigation, talent]); 


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
        'Error',
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

  const formatDateForApi = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const handleBooking = async () => {
  if (!talent) return;
  const clientPhone =
  user?.profile?.phone_number ||
  phoneNumber.trim();

  if (!eventDate) {
    Alert.alert('Error', 'Please select an event date.');
    return;
  }

  if (!venueAddress.trim()) {
    Alert.alert(
      'Error',
      'Please enter the event location.',
    );
    return;
  }

  

if (!clientPhone) {
  Alert.alert(
    'Error',
    'Please enter your phone number.'
  );
  return;
}
// alert(clientPhone)

  const formattedEventDate = formatDateForApi(eventDate);
   if (
      talent.is_charges_enabled &&
      talent.is_price_negotiable &&
      !offeredRate.trim()
    ) {
      Alert.alert(
        'Error',
        'Please enter your offered price.',
      );
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
  talent: talent.id,
  event_date: formattedEventDate,
  venue_address: venueAddress.trim(),
  offered_rate:
    talent.is_charges_enabled &&
    talent.is_price_negotiable
      ? offeredRate.trim()
      : undefined,
  currency: talent.currency,
  phone_number:clientPhone
});
      Alert.alert(
        'Booking Request Sent',
        'Your booking request has been sent to the talent.',
        [
          {
            text: 'OK',
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

      Alert.alert('Booking Failed', message);
    } finally {
      setSubmitting(false);
    }

  // ...
};
 

  if (loading) {
    return (
      <ProtectedRoute>
        <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading talent...
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
        <View style={styles.container}>
      {/* <Text style={styles.title}>
        Book {talent.stage_name}
      </Text> */}

      
      <BookingCalendar
  value={eventDate}
  onChange={setEventDate}
/>

      <Text style={styles.label}>
        Event Location
      </Text>

     <TextInput
  style={[styles.input, styles.locationInput]}
  placeholder="Enter event location"
  value={venueAddress}
  onChangeText={setVenueAddress}
  editable={!submitting}
  multiline
/>

      {/* PRICING */}

      {talent.is_charges_enabled && (
        <View style={styles.priceSection}>
          <Text style={styles.label}>
            Price
          </Text>

          <Text style={styles.price}>
            {talent.currency}{' '}
            {talent.fixed_rate || talent.hourly_rate}
          </Text>

          {talent.is_price_negotiable ? (
            <>
              <Text style={styles.helperText}>
                Price is negotiable. Enter your offer below.
              </Text>

              <TextInput
                style={styles.input}
                placeholder={`Your offer in ${talent.currency}`}
                value={offeredRate}
                onChangeText={setOfferedRate}
                keyboardType="decimal-pad"
                editable={!submitting}
              />
            </>
          ) : (
            <Text style={styles.helperText}>
              This price is not negotiable.
            </Text>
          )}
        </View>
      )}

      <Pressable
        style={[
          styles.button,
          submitting && styles.buttonDisabled,
        ]}
        onPress={handleBooking}
        disabled={submitting}
      >
        {user?.profile?.phone_number ? (
  <View style={styles.phoneSection}>
    <Text style={styles.label}>
      Phone Number
    </Text>

    {/* <Text style={styles.phoneText}></Text> */}
    <TextInput
      style={styles.input}
      placeholder="Enter your phone number"
      value={user.profile.phone_number}
      onChangeText={setPhoneNumber}
      keyboardType="phone-pad"
      editable={!submitting}
    />
  </View>
) : (
  <View style={styles.phoneSection}>
    <Text style={styles.label}>
      Phone Number
    </Text>

    <TextInput
      style={styles.input}
      placeholder="Enter your phone number"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      keyboardType="phone-pad"
      editable={!submitting}
    />
  </View>
)}
        {submitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>
            Send Booking Request
          </Text>
        )}
      </Pressable>
    </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:Mycolors.whitecolor
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  locationInput: {
  minHeight: 80,
  textAlignVertical: 'top',
},

  priceSection: {
    marginBottom: 10,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },

  helperText: {
    fontSize: 14,
    marginBottom: 12,
  },

  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },

   profilimage: {
    width: 30,
    height: 30,
    borderRadius: 25, // Optional: makes profile pictures circular
  },
  phoneSection: {
  marginBottom: 10,
  marginTop:30
},

phoneText: {
  fontSize: 16,
  marginBottom: 20,
  color:Mycolors.blackcolor
},
});

