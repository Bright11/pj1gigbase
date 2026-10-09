import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from 'expo-router';

import {
  getTalentBookings,
  updateBookingStatus,
} from '@/services/booking.service';

import type { Booking } from '@/types/booking';
import { Mycolors } from '@/constants/mycolors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProtectedRoute } from '@/utils/ProtectedRoute';

export default function BookingRequestsScreen() {
  const navigation = useNavigation();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

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

      const data = await getTalentBookings();

      setBookings(data);
    } catch (error: any) {
      console.log(
        'Unable to load booking requests:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Unable to load bookings',
        'Something went wrong while loading your booking requests.',
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
    status:
      | 'pending'
      | 'accepted'
      | 'declined'
      | 'cancelled'
      | 'completed',
  ) => {
    try {
      setActionLoading(bookingId);

      await updateBookingStatus(bookingId, status);

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status }
            : booking,
        ),
      );

      let title = 'Booking Updated';
      let message = 'The booking has been updated.';

      if (status === 'accepted') {
        title = 'Booking Accepted';
        message =
          'The client has been notified that you accepted the booking.';
      }

      if (status === 'declined') {
        title = 'Booking Declined';
        message = 'The booking request has been declined.';
      }

      if (status === 'completed') {
        title = 'Booking Completed';
        message = 'The booking has been marked as completed.';
      }

      Alert.alert(title, message);
    } catch (error: any) {
      console.log(
        'Booking action error:',
        error?.response?.data || error,
      );

      Alert.alert(
        'Booking Error',
        'Unable to update this booking. Please try again.',
      );
    } finally {
      setActionLoading(null);
    }
  };

  const confirmAction = (
    booking: Booking,
    status:
      | 'accepted'
      | 'declined'
      | 'completed',
  ) => {
    if (status === 'accepted') {
      Alert.alert(
        'Accept Booking',
        'Are you sure you want to accept this booking request?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Accept',
            onPress: () =>
              handleBookingAction(booking.id, 'accepted'),
          },
        ],
      );

      return;
    }

    if (status === 'declined') {
      Alert.alert(
        'Decline Booking',
        'Are you sure you want to decline this booking request?',
        [
          {
            text: 'Keep Request',
            style: 'cancel',
          },
          {
            text: 'Decline',
            style: 'destructive',
            onPress: () =>
              handleBookingAction(booking.id, 'declined'),
          },
        ],
      );

      return;
    }

    Alert.alert(
      'Complete Booking',
      'Mark this booking as completed?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Complete',
          onPress: () =>
            handleBookingAction(booking.id, 'completed'),
        },
      ],
    );
  };

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
      case 'accepted':
        return {
          label: 'Accepted',
          icon: 'checkmark-circle' as const,
          background: '#EAF7EF',
          color: Mycolors.greencolor,
        };

      case 'completed':
        return {
          label: 'Completed',
          icon: 'checkmark-done-circle' as const,
          background: '#EAF2FF',
          color: Mycolors.primarycolor,
        };

      case 'declined':
        return {
          label: 'Declined',
          icon: 'close-circle' as const,
          background: '#FFF0F0',
          color: Mycolors.redcolor,
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
    const isPending = item.status === 'pending';
    const isAccepted = item.status === 'accepted';
    const isLoading = actionLoading === item.id;

    const statusConfig = getStatusConfig(item.status);

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.clientInfo}>
            <View style={styles.clientAvatar}>
              <Ionicons
                name="person"
                size={20}
                color={Mycolors.primarycolor}
              />
            </View>

            <View style={styles.clientTextContainer}>
              <Text style={styles.requestedBy}>
                Booking Request
              </Text>

              <Text
                style={styles.clientName}
                numberOfLines={1}
              >
                {item.client_username}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusConfig.background,
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

        {/* Divider */}
        <View style={styles.divider} />

        {/* Event Information */}
        <View style={styles.infoSection}>
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
                Event Date
              </Text>

              <Text style={styles.infoValue}>
                {item.event_date}
              </Text>
            </View>
          </View>

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
                Event Location
              </Text>

              <Text
                style={styles.infoValue}
                numberOfLines={3}
              >
                {item.venue_address}
              </Text>
            </View>
          </View>
        </View>

        {/* Price */}
        {item.offered_rate ? (
          <View style={styles.priceBox}>
            <View>
              <Text style={styles.priceLabel}>
                OFFERED PRICE
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

        {/* Pending Actions */}
        {isPending && (
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.declineButton,
                isLoading && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                confirmAction(item, 'declined')
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color="#777"
                />
              ) : (
                <>
                  <Ionicons
                    name="close-outline"
                    size={18}
                    color="#555"
                  />

                  <Text style={styles.declineText}>
                    Decline
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.acceptButton,
                isLoading && styles.buttonDisabled,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                confirmAction(item, 'accepted')
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={Mycolors.primarycolor}
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={Mycolors.primarycolor}
                  />

                  <Text style={styles.acceptText}>
                    Accept Booking
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        )}

        {/* Accepted Action */}
        {isAccepted && (
          <Pressable
            style={({ pressed }) => [
              styles.completeButton,
              isLoading && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              confirmAction(item, 'completed')
            }
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color={Mycolors.whitecolor}
              />
            ) : (
              <>
                <Ionicons
                  name="checkmark-done-outline"
                  size={19}
                  color={Mycolors.whitecolor}
                />

                <Text style={styles.completeText}>
                  Mark as Completed
                </Text>
              </>
            )}
          </Pressable>
        )}
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
            Loading booking requests
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
          refreshing={loading}
          onRefresh={loadBookings}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            bookings.length === 0 &&
              styles.emptyListContent,
          ]}
          ListHeaderComponent={
            <View style={styles.pageHeader}>
              <View>
                <Text style={styles.title}>
                  Booking Requests
                </Text>

                <Text style={styles.subtitle}>
                  Manage requests from your clients
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
                No Booking Requests
              </Text>

              <Text style={styles.emptyText}>
                When clients request your services,
                their booking requests will appear
                here.
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

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },

  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF1F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  clientTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  requestedBy: {
    color: '#9A9FAB',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  clientName: {
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

  infoSection: {
    gap: 13,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 3,
  },

  infoValue: {
    color: '#343943',
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '600',
  },

  priceBox: {
    marginTop: 16,
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

  actions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 16,
  },

  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  declineButton: {
    backgroundColor: '#F5F6F7',
    borderWidth: 1,
    borderColor: '#E1E3E7',
  },

  acceptButton: {
    backgroundColor: Mycolors.secondarycolor,
  },

  declineText: {
    color: '#555A64',
    fontSize: 12,
    fontWeight: '800',
  },

  acceptText: {
    color: Mycolors.primarycolor,
    fontSize: 12,
    fontWeight: '900',
  },

  completeButton: {
    height: 48,
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: Mycolors.greencolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  completeText: {
    color: Mycolors.whitecolor,
    fontSize: 13,
    fontWeight: '900',
  },

  buttonDisabled: {
    opacity: 0.55,
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
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
