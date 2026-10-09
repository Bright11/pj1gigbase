import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity, Alert, StatusBar } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRoute, router, useNavigation, useFocusEffect } from 'expo-router';
import { ReactElement, useCallback, useLayoutEffect, useState } from 'react';
import { Mycolors } from '@/constants/mycolors';
import { getCurrentUser, logout } from '@/services/auth.service';
import AvailabilityToggle from '@/utils/AvailabilityToggle';
import { updateUserAvailability } from '@/services/profile.service';
import { useAuthStore } from '@/store/auth.store';
import { ProtectedRoute } from '@/utils/ProtectedRoute';




// export default function DashboardScreen() {
//   return (
//     <ProtectedRoute>
//       <DashboardContent />
//     </ProtectedRoute>
//   );
// }


export default function DashboardContent():ReactElement {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const refreshDashboard = async () => {
      try {
        console.log('DASHBOARD FOCUSED - refreshing user data');

        const currentUser = await getCurrentUser();

        if (isActive) {
          setUser(currentUser);
        }

        console.log(
          'DASHBOARD USER DATA REFRESHED:',
          currentUser
        );
      } catch (error) {
        console.error(
          'DASHBOARD REFRESH FAILED:',
          error
        );
      }
    };

    refreshDashboard();

    return () => {
      isActive = false;
    };
  }, [setUser])
);

  const navigation = useNavigation();
  const handlelogout = async () => {
    await logout();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Dashboard',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={10}
          style={styles.headerIconButton}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={handlelogout}
          hitSlop={10}
          style={styles.headerIconButton}
        >
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      ),
    });
  },[navigation]);

  console.log('current user data', user);

  const handleAvailabilityChange = async (value: boolean) => {
    if (!user) {
      return;
    }

    try {
      const response = await updateUserAvailability(value);

      setUser({
        ...user,
        is_available: response.is_available,
      });
    } catch (error) {
      console.error('Availability update failed:', error);

      Alert.alert('Error', 'Unable to update your availability.');
    }
  };

  return (
<ProtectedRoute>
   <StatusBar backgroundColor="white"/>
     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.greeting}>Welcome back</Text>
        <Text style={styles.title}>{user?.username}</Text>
      </View>

      {/* Availability */}
      <View style={styles.availabilityCard}>
        <AvailabilityToggle
          value={user?.is_available ?? false}
          onChange={handleAvailabilityChange}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#ECFDF5' }]}>
            <Ionicons name="checkmark-done-outline" size={18} color="#10B981" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.accepted_bookings}</Text>
          <Text style={styles.statLabel}>Accepted Booking</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
            <Ionicons name="calendar-outline" size={18} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.bookings}</Text>
          <Text style={styles.statLabel}>Booking</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#FDF4FF' }]}>
            <Ionicons name="images-outline" size={18} color="#A855F7" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.gallery_images}</Text>
          <Text style={styles.statLabel}>Pictures</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#FFFBEB' }]}>
            <Ionicons name="time-outline" size={18} color="#F59E0B" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.pending_bookings}</Text>
          <Text style={styles.statLabel}>Pending Booking</Text>
        </View>

        <Pressable style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#FEF2F2' }]}>
            <Ionicons name="star-outline" size={18} color="#EF4444" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.talents}</Text>
          <Text style={styles.statLabel}>Talents</Text>
        </Pressable>

        <Pressable style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#EEF2FF' }]}>
            <Ionicons name="videocam-outline" size={18} color="#6366F1" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.videos}</Text>
          <Text style={styles.statLabel}>Videos</Text>
        </Pressable>

        <Pressable style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: '#F0FDFA' }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#14B8A6" />
          </View>
          <Text style={styles.statValue}>{user?.dashboard?.unread_messages}</Text>
          <Text style={styles.statLabel}>Unread Messages</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <Text style={styles.sectionLabel}>Quick Actions</Text>

      <View style={styles.actionList}>
        <Link href="/chat/inbox" style={[styles.actionRow, styles.actionRowBorder]}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="mail-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>My Inbox</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Link>

        <Link href="/post-talent" style={[styles.actionRow, styles.actionRowBorder]}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="add-circle-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>Create post</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Link>

        <Link href="/my-talents" style={[styles.actionRow, styles.actionRowBorder]}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="briefcase-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>My Talents</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Link>

        <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={() => router.push('/booking/bookingrequest')}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="person-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>Booking request</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Pressable>

        <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={() => router.push('/booking/my-bookings')}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="calendar-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>My Booking</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Pressable>

        <Link href="/manage-skills/my-skills" style={[styles.actionRow, styles.actionRowBorder]}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="mail-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>My Skills</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Link>

        <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={() => router.push("/profile")}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="person-circle-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>Update profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Pressable>

        <Pressable
          style={styles.actionRow}
          onPress={() => router.push("/forgot-password")}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>Change password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Pressable>

        <Pressable
          style={[styles.actionRow,{backgroundColor:'#FEE2E2'}]}
          onPress={() => router.push("/delete-account")}
        >
          <View style={styles.actionLeft}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.actionLabel}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C1C5CD" />
        </Pressable>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
</ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerBlock: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  greeting: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },

  availabilityCard: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },

  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  statCard: {
    width: '47%',
    minHeight: 100,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F1F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: 3,
    textAlign: 'center',
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 28,
    marginHorizontal: 16,
    marginBottom: 10,
  },

  actionList: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
  },
});