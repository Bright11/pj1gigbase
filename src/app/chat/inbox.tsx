
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';



import type { Conversation } from '@/types/chat';
import { getConversations } from '@/services/chat.service';
import { useAuthStore } from '@/store/auth.store';

export default function ConversationsScreen() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);
    const user =useAuthStore(
        (state)=>state.user
    )
    const hasLoadedOnce = useRef(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

    const loadConversations = async (
  showLoading = false,
) => {
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
  const openConversation = (
    conversationId: string,
  ) => {
    router.push({
      pathname: '/chat/[conversationId]',
      params: {
        conversationId,
      },
    });
  };


const formatMessageTime = (
  date: string,
) => {
  const messageDate = new Date(date);
  const now = new Date();

  const isToday =
    messageDate.toDateString() ===
    now.toDateString();

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
const renderConversation = ({
  item,
}: {
  item: Conversation;
}) => {
  console.log('CURRENT USER:', user?.id);

  console.log(
    'PARTICIPANTS:',
    item.participants.map((p) => ({
      participantId: p.user.id,
      username: p.user.username,
    })),
  );

  const participant =
    item.participants.find(
      (p) =>
        String(p.user.id) !==
        String(user?.id),
    );

  console.log(
    'OTHER PARTICIPANT:',
    participant?.user.username,
  );

  return (
    <Pressable
      style={styles.conversationItem}
      onPress={() =>
        openConversation(item.id)
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {participant?.user.username
            ?.charAt(0)
            .toUpperCase()}
        </Text>
      </View>

      <View style={styles.conversationInfo}>
       <View style={styles.usernameRow}>
  <Text
    style={styles.username}
    numberOfLines={1}
  >
    {participant?.user.username}
  </Text>

  {item.unread_count > 0 && (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadBadgeText}>
        {item.unread_count > 99
          ? '99+'
          : item.unread_count}
      </Text>
    </View>
  )}
</View>

        <View style={styles.messageRow}>
  <View style={styles.lastMessageContainer}>
{String(item.last_message?.sender.id) === String(user?.id) && (
  <Text style={styles.readReceipt}>
    {item.last_message?.is_read ? '✓✓' : '✓'}
  </Text>
)}


  <Text
    style={styles.lastMessage}
    numberOfLines={1}
  >
    {item.last_message?.text &&
    item.last_message.text.length > 30
      ? `${item.last_message.text.slice(0, 30)}...`
      : item.last_message?.text}
  </Text>
</View>

  {item.last_message && (
    <Text style={styles.messageTime}>
      {formatMessageTime(
        item.last_message.created_at,
      )}
    </Text>
  )}
</View>
      </View>
    </Pressable>
  );
};

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <Text style={styles.title}>
          Messages
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={styles.statusText}>
              Loading conversations...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>
              {error}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={() => loadConversations(true)}
            >
              <Text style={styles.retryText}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              You have no conversations yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) =>
              item.id
            }
            renderItem={
              renderConversation
            }
          />
        )}
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Mycolors.whitecolor,

  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
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
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },

  emptyText: {
    color: '#777',
    textAlign: 'center',
  },

  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryText: {
    fontWeight: '600',
  },

  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },

  conversationInfo: {
    flex: 1,
  },

  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  lastMessage: {
    fontSize: 14,
    color: '#777',
  },

  messageRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

messageTime: {
  fontSize: 12,
  color: '#777',
  marginLeft: 8,
},
lastMessageContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

readReceipt: {
  fontSize: 14,
  fontWeight: '600',
  marginRight: 4,
},

usernameRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
},

unreadBadge: {
  minWidth: 22,
  height: 22,
  borderRadius: 11,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 6,
},

unreadBadgeText: {
  fontSize: 12,
  fontWeight: '700',
},
});

