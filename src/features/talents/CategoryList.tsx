
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';

import { getcategories } from '@/services/category.service';
import { Category } from '@/types/category';
import { Mycolors } from '@/constants/mycolors';
import { publicAPI } from '@/services/api';

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadCategories = async () => {
        try {
          setIsLoading(true);
          setError(null);

          // const data = await getcategories();
       const response = await publicAPI.get<Category[]>(
  '/api/categories/',
  {
    params: {
      random: 'true',
      limit: 9,
    },
  },
);

if (isActive) {
  setCategories(response.data);
}
        } catch (error) {
          console.log('Failed to load categories:', error);

          if (isActive) {
            setError('Unable to load categories');
          }
        } finally {
          if (isActive) {
            setIsLoading(false);
          }
        }
      };

      loadCategories();

      return () => {
        isActive = false;
      };
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Mycolors.secondarycolor}
        />

        <Text style={styles.loadingText}>
          Loading categories...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          Please check your internet connection or refresh the app.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.subtitle}>
            Find the perfect category for your needs
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/all-categories')}
          hitSlop={8}
        >
          <Text style={styles.seeAll}>
            See all
          </Text>
        </Pressable>
      </View>

      {/* 3 Column Category Grid */}
      <View style={styles.grid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => {
              console.log('Selected category:', category);

              router.push({
                pathname: '/services',
                params: {
                  category: category.slug,
                },
              });
            }}
          >
            {category.image ? (
  <Image
    source={{ uri: category.image }}
    style={styles.cardImage}
    contentFit="cover"
    cachePolicy="memory-disk"
    transition={200}
  />
) : (
  <View style={styles.cardImage} />
)}

            <View style={styles.cardOverlay} />

            <Text
              style={styles.cardTitle}
              numberOfLines={2}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: Mycolors.whitecolor,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  headerText: {
    flex: 1,
  },

  subtitle: {
    color: '#777',
    fontSize: 12,
    lineHeight: 18,
  },

  seeAll: {
    color: Mycolors.secondarycolor,
    fontSize: 12,
    fontWeight: '800',
  },

  /* =========================
     3 COLUMN GRID
  ========================= */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    width: '31.5%',
    height: 118,

    marginBottom: 12,

    borderRadius: 13,

    overflow: 'hidden',

    backgroundColor: '#eee',

    elevation: 2,

    shadowColor: Mycolors.primarycolor,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

 cardOverlay: {
  ...StyleSheet.absoluteFill,
  backgroundColor: 'rgba(1, 4, 37, 0.35)',
},

  cardTitle: {
    position: 'absolute',

    left: 9,
    right: 7,
    bottom: 9,

    color: Mycolors.whitecolor,

    fontSize: 12,
    lineHeight: 15,
    fontWeight: '800',
  },

  /* =========================
     LOADING / ERROR
  ========================= */

  center: {
    minHeight: 180,

    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 30,

    backgroundColor: Mycolors.whitecolor,
  },

  loadingText: {
    color: Mycolors.graycolor,
    marginTop: 10,
    fontSize: 13,
  },

  errorTitle: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },

  errorText: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
});
