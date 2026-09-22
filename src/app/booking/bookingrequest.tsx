import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import {
  getTalentBookings,
  updateBookingStatus,
} from '@/services/booking.service';
import type { Booking } from '@/types/booking';
import { Mycolors } from '@/constants/mycolors';

export default function BookingRequestsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await getTalentBookings();

      setBookings(data);
    } catch (error: any) {
      console.log(
        'Unable to load booking requests:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Unable to load booking requests.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleBookingAction = async (
    bookingId: number,
    status: 'accepted' | 'declined',
  ) => {
    try {
      setActionLoading(bookingId);

      await updateBookingStatus(
        bookingId,
        status,
      );

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status }
            : booking,
        ),
      );

      Alert.alert(
        status === 'accepted'
          ? 'Booking Accepted'
          : 'Booking Declined',
        status === 'accepted'
          ? 'The booking has been accepted.'
          : 'The booking has been declined.',
      );
    } catch (error: any) {
      console.log(
        'Booking action error:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Unable to update the booking. Please try again.',
      );
    } finally {
      setActionLoading(null);
    }
  };

  const renderBooking = ({
    item,
  }: {
    item: Booking;
  }) => {
    const isPending = item.status === 'pending';
    const isLoading = actionLoading === item.id;

    return (
      <View style={styles.card}>
        <Text style={styles.clientName}>
          {item.client_username}
        </Text>

        <Text style={styles.bookingStatus}>
          {item.status.toUpperCase()}
        </Text>

        <Text style={styles.label}>
          Event Date
        </Text>

        <Text style={styles.value}>
          {item.event_date}
        </Text>

        <Text style={styles.label}>
          Location
        </Text>

        <Text style={styles.value}>
          {item.venue_address}
        </Text>

        {item.offered_rate && (
          <>
            <Text style={styles.label}>
              Offered Price
            </Text>

            <Text style={styles.price}>
              {item.currency} {item.offered_rate}
            </Text>
          </>
        )}

        {isPending && (
          <View style={styles.actions}>
            <Pressable
              style={[
                styles.button,
                styles.declineButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={() =>
                handleBookingAction(
                  item.id,
                  'declined',
                )
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.declineText}>
                  Decline
                </Text>
              )}
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.acceptButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={() =>
                handleBookingAction(
                  item.id,
                  'accepted',
                )
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.acceptText}>
                  Accept
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading booking requests...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Booking Requests
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={renderBooking}
        refreshing={loading}
        onRefresh={loadBookings}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You don't have any booking requests yet.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Mycolors.whitecolor,
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
    marginBottom: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },

  clientName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },

  bookingStatus: {
    fontSize: 12,
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },

  value: {
    fontSize: 15,
    marginTop: 3,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },

  button: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptButton: {
    backgroundColor: Mycolors.primarycolor,
  },

  declineButton: {
    borderWidth: 1,
    borderColor: '#ccc',
  },

  acceptText: {
    color: '#fff',
    fontWeight: '600',
  },

  declineText: {
    fontWeight: '600',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
});