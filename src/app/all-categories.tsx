import React, { useCallback, useLayoutEffect, useState } from 'react';
import {
ActivityIndicator,
FlatList,
Pressable,
StyleSheet,
Text,
View,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useFocusEffect, useNavigation } from 'expo-router';

import { getcategories } from '@/services/category.service';
import type { Category } from '@/types/category';
import { Mycolors } from '@/constants/mycolors';


export default function AllCategoriesScreen() {
const [categories, setCategories] = useState<Category[]>([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const navigation =useNavigation()
useLayoutEffect(()=>{
    navigation.setOptions({
        headerShown:true,
        headerTitle:"All Categories"
    })

},[navigation])

const loadCategories = useCallback(async (pageToLoad: number, reset = false) => {
if (isLoading || (!hasMore && !reset)) return;


setIsLoading(true);
setError(null);

try {
  const response = await getcategories(pageToLoad, 10);

  setCategories((previous) =>
    reset ? response.results : [...previous, ...response.results],
  );

  setPage(pageToLoad + 1);
  setHasMore(response.links.next_page !== null);
} catch (err) {
  console.error('Failed to load categories:', err);
  setError('Unable to load categories. Please try again.');
} finally {
  setIsLoading(false);
}


}, [hasMore, isLoading]);

useFocusEffect(
useCallback(() => {
setCategories([]);
setPage(1);
setHasMore(true);
void loadCategories(1, true);
}, []),
);

return (
  <View style={styles.container}>
    <Text style={styles.heading}>All Categories</Text>

    <Text style={styles.subtitle}>
      Explore the talents available on PJ1 GIGBASE.
    </Text>

  {error && categories.length === 0 ? (
    <View style={styles.message}>
      <Text style={styles.error}>{error}</Text>
      <Pressable
        style={styles.retryButton}
        onPress={() => void loadCategories(1, true)}
      >
        <Text style={styles.retryText}>Try again</Text>
      </Pressable>
    </View>
  ) : (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={3}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      onEndReached={() => {
        if (!isLoading && hasMore) {
          void loadCategories(page);
        }
      }}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: '/services',
              params: { category: item.slug },
            })
          }
        >
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={200}
            />
          ) : (
            <View style={styles.image} />
          )}

          <View style={styles.overlay} />

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.name}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        isLoading ? (
          <ActivityIndicator
            size="large"
            color={Mycolors.secondarycolor}
          />
        ) : (
          <Text style={styles.message}>No categories found.</Text>
        )
      }
      ListFooterComponent={
        categories.length > 0 ? (
          <View style={styles.footer}>
            {isLoading && (
              <ActivityIndicator color={Mycolors.secondarycolor} />
            )}
            {!hasMore && (
              <Text style={styles.endText}>
                You have reached the end.
              </Text>
            )}
            {error && (
              <Pressable
                onPress={() => void loadCategories(page)}
              >
                <Text style={styles.retryText}>Load more failed. Tap to retry.</Text>
              </Pressable>
            )}
          </View>
        ) : null
      }
    />
  )}
</View>


);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: Mycolors.whitecolor,
paddingHorizontal: 16,
paddingTop: 20,
},
heading: {
fontSize: 24,
fontWeight: '800',
color: Mycolors.primarycolor,
},
subtitle: {
fontSize: 13,
color: '#777',
marginTop: 6,
marginBottom: 18,
},
list: {
paddingBottom: 30,
},
row: {
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
},
cardPressed: {
opacity: 0.85,
transform: [{ scale: 0.98 }],
},
image: {
width: '100%',
height: '100%',
},
overlay: {
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
footer: {
paddingVertical: 18,
alignItems: 'center',
gap: 10,
},
endText: {
color: '#777',
fontSize: 12,
},
message: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
padding: 24,
},
error: {
color: '#b91c1c',
textAlign: 'center',
marginBottom: 12,
},
retryButton: {
padding: 10,
},
retryText: {
color: Mycolors.secondarycolor,
fontWeight: '700',
textAlign: 'center',
},
});

