import { View, Text, StyleSheet, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRoute,router, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Mycolors } from '@/constants/mycolors';

export default function DashboardScreen() {
    // const router =useRoute()
  // TODO: replace with real values once connected to backend

   const navigation = useNavigation()
  
      useLayoutEffect(()=>{
        navigation.setOptions({
          headerShown: true,
          title:"",
          headerLeft:()=>(
            <TouchableOpacity onPress={()=> navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
           headerRight:()=>(
            <TouchableOpacity>
              <Text style={{color:Mycolors.whitecolor}}>Dashboard</Text>
            </TouchableOpacity>
          )
        })
      })
  const postsCount = 12;
  const unreadCount = 3;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{postsCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{postsCount}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{postsCount}</Text>
          <Text style={styles.statLabel}>Pictures</Text>
        </View>

        <Pressable
          style={styles.statCard}
          onPress={() => console.log('Navigate to inbox')}
        >
          <Text style={styles.statValue}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Unread messages</Text>
        </Pressable>
      </View>

      {/* Actions */}
      <View style={styles.actionList}>
        <Link href="/chat/inbox"
          style={[styles.actionRow, styles.actionRowBorder]}
          
        >
          <View style={styles.actionLeft}>
            <Ionicons name="add-circle-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>My Inbox</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Link>

        <Link href="/post-talent"
          style={[styles.actionRow, styles.actionRowBorder]}
          
        >
          <View style={styles.actionLeft}>
            <Ionicons name="add-circle-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>Create post</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Link>

         <Link href="/my-talents"
          style={[styles.actionRow, styles.actionRowBorder]}
          
        >
          <View style={styles.actionLeft}>
            <Ionicons name="add-circle-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>My Talents</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Link>

         <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={()=>router.push('/booking/bookingrequest') }
        >
          <View style={styles.actionLeft}>
            <Ionicons name="person-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>Booking request</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Pressable>

        <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={()=>router.push('/booking/my-bookings') }
        >
          <View style={styles.actionLeft}>
            <Ionicons name="person-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>My Booking</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Pressable>

        <Pressable
          style={[styles.actionRow, styles.actionRowBorder]}
          onPress={() => console.log('Navigate to profile edit')}
        >
          <View style={styles.actionLeft}>
            <Ionicons name="person-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>Update profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Pressable>

        <Pressable
          style={styles.actionRow}
          onPress={() => console.log('Navigate to change password')}
        >
          <View style={styles.actionLeft}>
            <Ionicons name="lock-closed-outline" size={20} color="#333" />
            <Text style={styles.actionLabel}>Change password</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999" />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 16,
    marginHorizontal: 16,
  },
statsRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
  paddingHorizontal: 16,
  marginTop: 16,
},
statCard: {
  width: '47%', // 2 per row with the 12px gap; use '31%' for 3 per row
  minHeight: 90,
  backgroundColor: '#f5f5f5',
  borderRadius: 12,
  paddingVertical: 18,
  alignItems: 'center',
},
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionList: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#222',
  },
});