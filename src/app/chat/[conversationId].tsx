import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { useAuthStore } from '@/store/auth.store';

import {
  getConversationMessages,
  markConversationAsRead,
  sendMessage,
} from '@/services/chat.service';

import type { Message } from '@/types/chat';
import { getApiErrorMessage } from '@/services/api.error';

// A message list item is either a real message or a synthetic date divider.
type ListItem =
  | { kind: 'divider'; id: string; label: string }
  | { kind: 'message'; id: string; message: Message };

function formatDayLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() === today.getFullYear()
        ? undefined
        : 'numeric',
  });
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function buildListData(messages: Message[]): ListItem[] {
  const items: ListItem[] = [];
  let lastDayLabel: string | null = null;

  for (const message of messages) {
    const dayLabel = formatDayLabel(message.created_at);

    if (dayLabel !== lastDayLabel) {
      items.push({
        kind: 'divider',
        id: `divider-${message.id}`,
        label: dayLabel,
      });
      lastDayLabel = dayLabel;
    }

    items.push({ kind: 'message', id: String(message.id), message });
  }

  return items;
}

export default function ChatScreen() {
  const { conversationId, recipientName } =
    useLocalSearchParams<{
      conversationId: string;
      recipientName?: string;
    }>();
 

  const router = useRouter();

  const user = useAuthStore(
    (state) => state.user,
  );

  const insets = useSafeAreaInsets();

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [messageText, setMessageText] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const listRef = useRef<FlatList<ListItem>>(null);
  const lastMessageIdRef=useRef<string |number|null>(null)
  const hasScrolledToBottomRef = useRef(false)

 
const loadMessages = async () => {
  if (!conversationId) return;

  try {
    const data = await getConversationMessages(
      conversationId,
    );

    setMessages(data);
    // if(data.length>0 && hasScrolledToBottomRef.current){
    //   hasScrolledToBottomRef.current=true
    //   setTimeout(()=>{
    //     listRef.current?.scrollToEnd({
    //       animated:false
    //     });
    //   },100)
    // }

    const latestMessage = data[data.length - 1];

    if (!latestMessage) {
      setLoading(false);
      return;
    }

    const latestMessageId = latestMessage.id;

    const isFirstLoad =
      lastMessageIdRef.current === null;

    const isNewMessage =
      lastMessageIdRef.current !== null &&
      String(lastMessageIdRef.current) !==
        String(latestMessageId);

    const isIncomingMessage =
      String(latestMessage.sender.id) !==
      String(user?.id);

    if (
      isFirstLoad ||
      (isNewMessage && isIncomingMessage)
    ) {
      await markConversationAsRead(
        conversationId,
      );
    }

    lastMessageIdRef.current = latestMessageId;
  } catch (error) {
    console.log(
      'Error loading messages:',
      getApiErrorMessage(error),
    );

    setError('Unable to load messages.');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!conversationId) return;

  // Load immediately.
  loadMessages();

  // Continue checking for new messages.
  const interval = setInterval(() => {
    loadMessages();
  }, 3000);

  return () => {
    clearInterval(interval);
  };
}, [conversationId]);



  // const handlemarkasread = async () => {
  //   if (!conversationId) return;
  //   try {
  //     await markConversationAsRead(
  //       conversationId,
  //     );
  //   } catch (err) {
  //     console.log(
  //       'error while marking message as read',
  //       getApiErrorMessage(err),
  //     );
  //   }
  // };

  // useEffect(() => {
  //   loadMessages();
  
  // }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      // Give the list a beat to lay out before scrolling.
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages.length]);

 const handleSendMessage = async () => {
  const text = messageText.trim();

  if (
    !conversationId ||
    !text ||
    sending
  ) {
    return;
  }

  try {
    setSending(true);
    setError(null);

    await sendMessage(
      conversationId,
      text,
    );

    setMessageText('');

    await loadMessages();
  } catch (error) {
    setError(
      'Unable to send message.',
    );
  } finally {
    setSending(false);
  }
};


  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.kind === 'divider') {
      return (
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerLabel}>{item.label}</Text>
          <View style={styles.dividerLine} />
        </View>
      );
    }

    const { message } = item;
    const isMine =
      message.sender.id === String(user?.id);

    return (
      <View
        style={[
          styles.messageRow,
          isMine ? styles.myMessageRow : styles.otherMessageRow,
        ]}
      >
        {!isMine && (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(message.sender.username)}
            </Text>
           
          </View>
        )}

        <View
          style={[
            styles.messageContainer,
            isMine
              ? styles.myMessageContainer
              : styles.otherMessageContainer,
          ]}
        >
          {!isMine && (
            <Text style={styles.senderName}>
              {message.sender.username}
            </Text>
          )}

          <View
            style={[
              styles.messageBubble,
              isMine
                ? styles.myMessageBubble
                : styles.otherMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isMine && styles.myMessageText,
              ]}
            >
              {message.text}
            </Text>
            {isMine &&(
               <Text style={{fontSize:14,marginLeft:4,fontWeight:'600'}}>
              {message?.is_read? '✓✓':'✓'}
            </Text>
            )}
          </View>

          <Text
            style={[
              styles.messageTime,
              isMine ? styles.myMessageTime : styles.otherMessageTime,
            ]}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  const listData = buildListData(messages);

  const otherParticipant = messages.find(
    (message) => message.sender.id !== String(user?.id),
  )?.sender.username;

  const headerTitle = recipientName || otherParticipant || 'Chat';

  // Used to keep the input bar clear of the keyboard, accounting for the
  // header we render above the KeyboardAvoidingView.
  const headerHeight = insets.top + 54;

  return (
    <ProtectedRoute>
      <View
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.headerBackButton}
        >
          <Text style={styles.headerBackIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        {/* Spacer to keep the title visually centered against the back button */}
        <View style={styles.headerBackButton} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Mycolors.primarycolor ?? '#007AFF'} />

            <Text style={styles.statusText}>
              Loading messages...
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              ref={listRef}
              data={listData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
             
              contentContainerStyle={
                listData.length === 0
                  ? styles.emptyList
                  : styles.messageList
              }
              onContentSizeChange={() => {
              if (
                messages.length > 0 &&
                !hasScrolledToBottomRef.current
              ) {
                hasScrolledToBottomRef.current = true;

                listRef.current?.scrollToEnd({
                  animated: false,
                });
              }
            }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconCircle}>
                    <Text style={styles.emptyIconText}>💬</Text>
                  </View>
                  <Text style={styles.emptyTitle}>No messages yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Say hello to get the conversation started.
                  </Text>
                </View>
              }
            />

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={() => setError(null)} hitSlop={8}>
                  <Text style={styles.errorDismiss}>✕</Text>
                </Pressable>
              </View>
            )}

            <View
              style={[
                styles.inputContainer,
                { paddingBottom: Math.max(insets.bottom, 12) },
              ]}
            >
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor="#9a9a9a"
                value={messageText}
                onChangeText={setMessageText}
                multiline
                editable={!sending}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.sendButton,
                  (sending || !messageText.trim()) &&
                    styles.sendButtonDisabled,
                  pressed && messageText.trim() && !sending
                    ? styles.sendButtonPressed
                    : null,
                ]}
                onPress={handleSendMessage}
                disabled={sending || !messageText.trim()}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.sendButtonText}>➤</Text>
                )}
              </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
    backgroundColor: Mycolors.whitecolor,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e2e2',
  },

  headerBackButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerBackIcon: {
    fontSize: 30,
    lineHeight: 30,
    color: '#007AFF',
    fontWeight: '400',
  },

  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },

  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },

  // Date dividers
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingHorizontal: 8,
  },

  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#dcdcdc',
  },

  dividerLabel: {
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },

  // Empty state
  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  emptyIconText: {
    fontSize: 28,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },

  emptySubtitle: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },

  // Message list
  messageList: {
    padding: 16,
    paddingBottom: 8,
  },

  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'flex-end',
  },

  myMessageRow: {
    justifyContent: 'flex-end',
  },

  otherMessageRow: {
    justifyContent: 'flex-start',
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dbe4ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3654c4',
  },

  messageContainer: {
    maxWidth: '75%',
  },

  myMessageContainer: {
    alignItems: 'flex-end',
  },

  otherMessageContainer: {
    alignItems: 'flex-start',
  },

  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
    marginLeft: 2,
  },

  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },

  myMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },

  otherMessageBubble: {
    backgroundColor: '#f0f0f0',
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    lineHeight: 21,
    color: '#222',
  },

  myMessageText: {
    color: '#ffffff',
  },

  messageTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },

  myMessageTime: {
    marginRight: 2,
  },

  otherMessageTime: {
    marginLeft: 2,
  },

  // Error banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fdecea',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  errorText: {
    color: '#c0392b',
    fontSize: 13,
    flex: 1,
    marginRight: 8,
  },

  errorDismiss: {
    color: '#c0392b',
    fontSize: 14,
    fontWeight: '600',
  },

  // Input bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e2e2e2',
    gap: 8,
    backgroundColor: Mycolors.whitecolor,
  },

  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#222',
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
  },

  sendButtonPressed: {
    opacity: 0.85,
  },

  sendButtonDisabled: {
    backgroundColor: '#b9d7ff',
  },

  sendButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
});