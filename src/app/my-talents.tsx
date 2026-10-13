import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect, router, useNavigation } from 'expo-router';

import { getMyTalents } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Talent } from '@/types/Talent';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';

import { Mycolors } from '@/constants/mycolors';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function MyTalentsScreen() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    headerTitle: "",
    headerStyle: {
      backgroundColor: Mycolors.primarycolor,
    },
    // Left Back Button
    headerLeft: () => (
      <Pressable
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          padding: 8,
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Makes it easier to tap
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
        />
      </Pressable>
    ),
    // Right Login Button (Now clickable and styled!)
    headerRight: () => (
     
        <Pressable
            onPress={() => router.push('/post-talent')}
             style={{
          marginRight: 15,
          padding: 8,
        }}
             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
    )
  });
}, [navigation]);


          
       

  const loadTalents = async () => {
    try {
      setIsLoading(true);

      const data = await getMyTalents();
      setTalents(data);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTalents();
    }, [])
  );

  const renderTalent = ({ item }: { item: Talent }) => {
    const image = item.gallery_images?.find(
      (galleryImage) => galleryImage.image_url
    )?.image_url;

    return (
      <View style={styles.card}>
        <View style={styles.imageWrap}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={22} color="#C1C5CD" />
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}

          {item.category_details && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText} numberOfLines={1}>
                {item.category_details.name}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.stageName} numberOfLines={1}>
                {item.stage_name || item.title}
              </Text>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
            </View>

            <View style={styles.ratingPill}>
              <Ionicons name="star" size={13} color="#F59E0B" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Feather name="check-circle" size={13} color="#6B7280" />
              <Text style={styles.stat}>{item.total_bookings} bookings</Text>
            </View>

            <View style={styles.rateWrap}>
              {item.hourly_rate && (
                <Text style={styles.rate}>
                  {item.currency} {item.hourly_rate}
                  <Text style={styles.rateUnit}>/hr</Text>
                </Text>
              )}

              {item.fixed_rate && (
                <Text style={styles.rate}>
                  {item.currency} {item.fixed_rate}
                  <Text style={styles.rateUnit}> fixed</Text>
                </Text>
              )}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.manageButton,
              pressed && styles.manageButtonPressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/manage-talent/[id]',
                params: { id: item?.id },
              })
            }
          >
            <Text style={styles.manageButtonText}>Manage Talent</Text>
            <Feather name="arrow-right" size={16} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
     <ProtectedRoute>

       <View style={styles.center}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.loadingText}>Loading your talents...</Text>
      </View>
     </ProtectedRoute>
    );
  }

  return (
  <ProtectedRoute>
     <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <StatusBar style="auto" />
      <View style={styles.container}>
      {talents.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconWrap}>
            <Feather name="briefcase" size={30} color="#9CA3AF" />
          </View>

          <Text style={styles.emptyTitle}>No talents yet</Text>

          <Text style={styles.emptyText}>
            Create your first talent profile and start building your portfolio.
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
            ]}
            onPress={() => router.push('/post-talent')}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.createButtonText}>Create Talent</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={talents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTalent}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
    </SafeAreaView>
  </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Header
  headersettings: {
    backgroundColor: Mycolors.whitecolor,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButtonPressed: {
    backgroundColor: '#F3F4F6',
  },
  headerAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  headerAddButtonPressed: {
    opacity: 0.85,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // List
  list: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  separator: {
    height: 16,
  },

  // Card
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F1F3',
  },
  imageWrap: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 190,
    backgroundColor: '#F3F4F6',
  },
  imagePlaceholder: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(17,24,39,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    maxWidth: '70%',
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  stageName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
  },
  title: {
    marginTop: 2,
    fontSize: 13,
    color: '#9CA3AF',
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F1F3',
    marginVertical: 12,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stat: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  rateWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  rate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  rateUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },

  manageButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#111827',
  },
  manageButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  manageButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  // Loading
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#111827',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  createButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  createButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});