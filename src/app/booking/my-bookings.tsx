import { useCallback, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';

import { getMyBookings } from '@/services/booking.service';
import type { Booking } from '@/types/booking';
import { Mycolors } from '@/constants/mycolors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProtectedRoute } from '@/utils/ProtectedRoute';

export default function MyBookingsScreen() {
  const navigation = useNavigation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: Mycolors.primarycolor,
      },
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Mycolors.whitecolor}
          />
        </Pressable>
      ),
    });
  }, [navigation]);

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
        'Unable to load bookings',
        'Something went wrong while loading your bookings.',
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
        'Refresh Failed',
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

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Accepted',
          icon: 'checkmark-circle' as const,
          background: '#EAF7EF',
          color: Mycolors.greencolor,
        };

      case 'declined':
        return {
          label: 'Declined',
          icon: 'close-circle' as const,
          background: '#FFF0F0',
          color: Mycolors.redcolor,
        };

      case 'completed':
        return {
          label: 'Completed',
          icon: 'checkmark-done-circle' as const,
          background: '#EAF2FF',
          color: Mycolors.primarycolor,
        };

      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: 'ban' as const,
          background: '#F2F3F5',
          color: '#777C87',
        };

      default:
        return {
          label: 'Pending',
          icon: 'time' as const,
          background: '#FFF8E5',
          color: '#A36D00',
        };
    }
  };

  const renderBooking = ({
    item,
  }: {
    item: Booking;
  }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.talentInfo}>
            <View style={styles.talentAvatar}>
              <Ionicons
                name="person"
                size={20}
                color={Mycolors.primarycolor}
              />
            </View>

            <View style={styles.talentTextContainer}>
              <Text style={styles.bookingLabel}>
                TALENT
              </Text>

              <Text
                style={styles.talentName}
                numberOfLines={1}
              >
                {item.talent_stage_name}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusConfig.background,
              },
            ]}
          >
            <Ionicons
              name={statusConfig.icon}
              size={14}
              color={statusConfig.color}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color: statusConfig.color,
                },
              ]}
            >
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Event Date */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Mycolors.primarycolor}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>
              EVENT DATE
            </Text>

            <Text style={styles.infoValue}>
              {item.event_date}
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="location-outline"
              size={18}
              color={Mycolors.primarycolor}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>
              EVENT LOCATION
            </Text>

            <Text
              style={styles.infoValue}
              numberOfLines={3}
            >
              {item.venue_address}
            </Text>
          </View>
        </View>

        {/* Price */}
        {item.offered_rate ? (
          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>
                BOOKING PRICE
              </Text>

              <Text style={styles.price}>
                {item.currency} {item.offered_rate}
              </Text>
            </View>

            <View style={styles.priceIcon}>
              <Ionicons
                name="cash-outline"
                size={22}
                color={Mycolors.secondarycolor}
              />
            </View>
          </View>
        ) : null}
      </View>
    );
  };

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
            color={Mycolors.primarycolor}
          />

          <Text style={styles.loadingTitle}>
            Loading your bookings
          </Text>

          <Text style={styles.loadingSubtitle}>
            Please wait a moment...
          </Text>
        </View>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderBooking}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshBookings}
              tintColor={Mycolors.primarycolor}
              colors={[Mycolors.primarycolor]}
            />
          }
          contentContainerStyle={[
            styles.listContent,
            bookings.length === 0 &&
              styles.emptyListContent,
          ]}
          ListHeaderComponent={
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.title}>
                  My Bookings
                </Text>

                <Text style={styles.subtitle}>
                  Keep track of your talent bookings
                </Text>
              </View>

              {bookings.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {bookings.length}
                  </Text>
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={42}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No Bookings Yet
              </Text>

              <Text style={styles.emptyText}>
                Your bookings will appear here once
                you request a talent for your event.
              </Text>
            </View>
          }
        />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  headerBackButton: {
    marginLeft: 10,
    padding: 8,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  title: {
    color: Mycolors.primarycolor,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  subtitle: {
    color: '#7D8390',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 9,
    borderRadius: 17,
    backgroundColor: Mycolors.secondarycolor,
    alignItems: 'center',
    justifyContent: 'center',
  },

  countText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '900',
  },

  card: {
    backgroundColor: Mycolors.whitecolor,
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAECF0',

    shadowColor: Mycolors.blackcolor,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 14,

    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  talentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  talentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF1F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  talentTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  bookingLabel: {
    color: '#9A9FAB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  talentName: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '900',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 8,
    gap: 4,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#EFF0F3',
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#F2F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  infoContent: {
    flex: 1,
    paddingTop: 1,
  },

  infoLabel: {
    color: '#989DA8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 3,
  },

  infoValue: {
    color: '#343943',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  priceBox: {
    marginTop: 2,
    padding: 13,
    borderRadius: 14,
    backgroundColor: Mycolors.primarycolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: {
    color: '#AEB4C2',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 3,
  },

  price: {
    color: Mycolors.whitecolor,
    fontSize: 19,
    fontWeight: '900',
  },

  priceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(247,185,40,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  loadingTitle: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },

  loadingSubtitle: {
    color: '#9095A1',
    fontSize: 12,
    marginTop: 5,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 35,
    marginTop: 80,
  },

  emptyIcon: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    color: Mycolors.primarycolor,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 8,
  },

  emptyText: {
    color: '#858B97',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});