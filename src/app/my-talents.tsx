import React, { useCallback, useState } from 'react';
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
import { useFocusEffect, router } from 'expo-router';

import { getMyTalents } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Talent } from '@/types/Talent';


export default function MyTalentsScreen() {
  const [talents, setTalents] = useState<Talent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              No Image
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.stageName}>
            {item.stage_name || item.title}
          </Text>

          <Text style={styles.title}>
            {item.title}
          </Text>

          {item.category_details && (
            <Text style={styles.category}>
              {item.category_details.name}
            </Text>
          )}

          <View style={styles.stats}>
            <Text style={styles.stat}>
              ⭐ {item.rating}
            </Text>

            <Text style={styles.stat}>
              {item.total_bookings} bookings
            </Text>
          </View>

          <View style={styles.rateContainer}>
            {item.hourly_rate && (
              <Text style={styles.rate}>
                {item.currency} {item.hourly_rate}/hr
              </Text>
            )}

            {item.fixed_rate && (
              <Text style={styles.rate}>
                {item.currency} {item.fixed_rate} fixed
              </Text>
            )}
          </View>

          <Pressable
            style={styles.manageButton}
            onPress={() =>
              router.push({
                pathname:"/manage-talent/[id]",
                params:{id:item?.id}
              })
            }
          >
            <Text style={styles.manageButtonText}>
              Manage Talent
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading your talents...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>
            My Talents
          </Text>

          <Text style={styles.subtitle}>
            Manage your talents and media
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/post-talent')}
        >
          <Text style={styles.addButtonText}>
            + Add
          </Text>
        </Pressable>
      </View>

      {talents.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            You haven't created a talent yet
          </Text>

          <Text style={styles.emptyText}>
            Create your first talent profile and start
            building your portfolio.
          </Text>

          <Pressable
            style={styles.createButton}
            onPress={() => router.push('/post-talent')}
          >
            <Text style={styles.createButtonText}>
              Create Talent
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={talents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTalent}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  heading: {
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    opacity: 0.6,
  },

  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#000',
  },

  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    marginBottom: 18,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 190,
  },

  imagePlaceholder: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },

  placeholderText: {
    opacity: 0.5,
  },

  content: {
    padding: 16,
  },

  stageName: {
    fontSize: 21,
    fontWeight: '700',
  },

  title: {
    marginTop: 4,
    fontSize: 15,
    opacity: 0.7,
  },

  category: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  stats: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 12,
  },

  stat: {
    fontSize: 14,
  },

  rateContainer: {
    marginTop: 10,
  },

  rate: {
    fontSize: 14,
    fontWeight: '600',
  },

  manageButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#000',
  },

  manageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    opacity: 0.6,
  },

  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 21,
  },

  createButton: {
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: '#000',
  },

  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});