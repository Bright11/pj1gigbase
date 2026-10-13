import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect, useNavigation } from 'expo-router';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';

import type { Conversation } from '@/types/chat';
import { getConversations } from '@/services/chat.service';
import { useAuthStore } from '@/store/auth.store';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function ConversationsScreen() {
  const navigation = useNavigation();
 
  useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerTitle: "",
    headerStyle: {
      backgroundColor: Mycolors.primarycolor,
    },
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          padding: 8,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
        />
      </Pressable>
    ),
    headerRight:()=>(
      <Text style={[styles.title,{color:Mycolors.whitecolor}]}>Messages</Text>
    )
  });
}, [navigation]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const user = useAuthStore((state) => state.user);
  const hasLoadedOnce = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }

      setError(null);

      const data = await getConversations();

      setConversations(data);

      hasLoadedOnce.current = true;
    } catch (error) {
      setError('Unable to load conversations.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Show loading only the first time Inbox opens.
      loadConversations(!hasLoadedOnce.current);

      // Silent background refresh every 15 seconds.
      const interval = setInterval(() => {
        loadConversations(false);
      }, 15000);

      return () => {
        clearInterval(interval);
      };
    }, [])
  );

  const openConversation = (conversationId: string) => {
    router.push({
      pathname: '/chat/[conversationId]',
      params: {
        conversationId,
      },
    });
  };

  const formatMessageTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();

    const isToday = messageDate.toDateString() === now.toDateString();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      });
    }

    return messageDate.toLocaleDateString([], {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    console.log('CURRENT USER:', user?.id);

    console.log(
      'PARTICIPANTS:',
      item.participants.map((p) => ({
        participantId: p.user.id,
        username: p.user.username,
      }))
    );

    const participant = item.participants.find(
      (p) => String(p.user.id) !== String(user?.id)
    );

    console.log('OTHER PARTICIPANT:', participant?.user.username);

    const isUnread = item.unread_count > 0;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.conversationItem,
          pressed && styles.conversationItemPressed,
        ]}
        onPress={() => openConversation(item.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {participant?.user.username?.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View style={styles.conversationInfo}>
          <View style={styles.usernameRow}>
            <Text
              style={[styles.username, isUnread && styles.usernameUnread]}
              numberOfLines={1}
            >
              {participant?.user.username}
            </Text>

            {item.last_message && (
              <Text
                style={[
                  styles.messageTime,
                  isUnread && styles.messageTimeUnread,
                ]}
              >
                {formatMessageTime(item.last_message.created_at)}
              </Text>
            )}
          </View>

          <View style={styles.messageRow}>
            <View style={styles.lastMessageContainer}>
              {String(item.last_message?.sender.id) === String(user?.id) && (
                <Ionicons
                  name={
                    item.last_message?.is_read
                      ? 'checkmark-done'
                      : 'checkmark'
                  }
                  size={15}
                  color={item.last_message?.is_read ? '#3B82F6' : '#9CA3AF'}
                  style={styles.readReceiptIcon}
                />
              )}

              <Text
                style={[
                  styles.lastMessage,
                  isUnread && styles.lastMessageUnread,
                ]}
                numberOfLines={1}
              >
                {item.last_message?.text &&
                item.last_message.text.length > 30
                  ? `${item.last_message.text.slice(0, 30)}...`
                  : item.last_message?.text}
              </Text>
            </View>

            {isUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {item.unread_count > 99 ? '99+' : item.unread_count}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ProtectedRoute>
       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
           <StatusBar style="auto" />
      <View style={styles.container}>
        

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color="#111827" />
            <Text style={styles.statusText}>Loading conversations...</Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <View style={styles.errorIconWrap}>
              <Ionicons name="cloud-offline-outline" size={26} color="#EF4444" />
            </View>
            <Text style={styles.errorText}>{error}</Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.retryButtonPressed,
              ]}
              onPress={() => loadConversations(true)}
            >
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.center}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="chatbubbles-outline" size={30} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyText}>
              Your conversations will show up here once you start chatting.
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderConversation}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      </SafeAreaView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
   topheader:{
      backgroundColor:Mycolors.whitecolor,
      paddingTop:6,
      paddingBottom:6,
      width:"100%"
    },
  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },

  listContent: {
    paddingBottom: 12,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  statusText: {
    marginTop: 10,
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },

  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  errorText: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 18,
    fontSize: 14,
  },

  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#111827',
  },
  retryButtonPressed: {
    opacity: 0.85,
  },

  retryText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 14,
  },

  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  conversationItemPressed: {
    backgroundColor: '#FAFAFA',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#EEF2FF',
  },

  avatarText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4F46E5',
  },

  conversationInfo: {
    flex: 1,
  },

  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flexShrink: 1,
  },
  usernameUnread: {
    color: '#111827',
    fontWeight: '700',
  },

  messageTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  messageTimeUnread: {
    color: '#111827',
    fontWeight: '600',
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  readReceiptIcon: {
    marginRight: 4,
  },

  lastMessage: {
    fontSize: 14,
    color: '#9CA3AF',
    flexShrink: 1,
  },
  lastMessageUnread: {
    color: '#374151',
    fontWeight: '500',
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    backgroundColor: '#EF4444',
    marginLeft: 8,
  },

  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
});