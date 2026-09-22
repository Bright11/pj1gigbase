import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';

import { getMyBookings } from '@/services/booking.service';
import type { Booking } from '@/types/booking';
import { Mycolors } from '@/constants/mycolors';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await getMyBookings();

      setBookings(data);
    } catch (error: any) {
      console.log(
        'Unable to load my bookings:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Unable to load your bookings. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshBookings = async () => {
    try {
      setRefreshing(true);

      const data = await getMyBookings();

      setBookings(data);
    } catch (error: any) {
      console.log(
        'Unable to refresh bookings:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Error',
        'Unable to refresh your bookings.',
      );
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, []),
  );

  const renderBooking = ({
    item,
  }: {
    item: Booking;
  }) => {
    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.talentName}>
            {item.talent_stage_name}
          </Text>

          <View
            style={[
              styles.statusBadge,
              item.status === 'accepted' &&
                styles.acceptedBadge,
              item.status === 'declined' &&
                styles.declinedBadge,
              item.status === 'pending' &&
                styles.pendingBadge,
              item.status === 'cancelled' &&
                styles.cancelledBadge,
              item.status === 'completed' &&
                styles.completedBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

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
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading your bookings...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My Bookings
      </Text>

      <FlatList
        data={bookings}
        keyExtractor={(item) =>
          String(item.id)
        }
        renderItem={renderBooking}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshBookings}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            You don't have any bookings yet.
          </Text>
        }
        showsVerticalScrollIndicator={false}
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
    backgroundColor: Mycolors.whitecolor,
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
    marginBottom: 14,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  talentName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  acceptedBadge: {
    backgroundColor: '#d4edda',
  },

  declinedBadge: {
    backgroundColor: '#f8d7da',
  },

  pendingBadge: {
    backgroundColor: '#fff3cd',
  },

  cancelledBadge: {
    backgroundColor: '#e2e3e5',
  },

  completedBadge: {
    backgroundColor: '#cce5ff',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});

