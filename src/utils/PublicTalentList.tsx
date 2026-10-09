import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { PublicTalent } from '@/types/Talent';
import { getPublicTalents } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { getUserCountryCode } from '@/services/country.service';
import { useAuthStore } from '@/store/auth.store';

import PublicTalentCard from './PublicTalentCard';


interface PublicTalentListProps {
  search: string;
  category?: string;
}

export default function PublicTalentList({
  search,
  category
}: PublicTalentListProps) {
  const [talents, setTalents] = useState<PublicTalent[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState<string | undefined>(
    undefined,
  );
  

  const user = useAuthStore((state) => state.user);

  
  useEffect(() => {
    let isMounted = true;

    const resolveCountry = async () => {
      const profileCountry =
        user?.profile?.country?.trim().toUpperCase();

      if (profileCountry) {
        if (isMounted) {
          setCountry(profileCountry);
        }

        return;
      }

      const detectedCountry =
        await getUserCountryCode();

      if (isMounted) {
        setCountry(
          detectedCountry?.trim().toUpperCase() ||
            undefined,
        );
      }
    };

    resolveCountry();

    return () => {
      isMounted = false;
    };
  }, [user?.profile?.country]);

  const loadTalents = useCallback(
    async (
      pageNumber: number,
      refresh = false,
    ) => {
      try {
        setError(null);

        if (refresh) {
          setIsRefreshing(true);
        } else if (pageNumber === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const data = await getPublicTalents(
          pageNumber,
          search,
          country,
          category
        );

        if (pageNumber === 1) {
          setTalents(data.results);
        } else {
          setTalents((current) => [
            ...current,
            ...data.results,
          ]);
        }

        setPage(data.current_page);

        setHasNextPage(
          data.links.next_page !== null,
        );
      } catch (error) {
        setError(getApiErrorMessage(error));
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [search, country, category],
  );

  /*
   * Reload when search or country changes.
   *
   * We intentionally use only ONE effect here.
   * Your previous version had two effects that
   * could both request page 1.
   */
  useEffect(() => {
    setPage(1);
    setHasNextPage(true);
    setTalents([]);

    loadTalents(1);
  }, [loadTalents]);

  const handleRefresh = () => {
    loadTalents(1, true);
  };

  const handleLoadMore = () => {
    if (
      isLoading ||
      isRefreshing ||
      isLoadingMore ||
      !hasNextPage
    ) {
      return;
    }

    loadTalents(page + 1);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error && talents.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={talents}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <PublicTalentCard
          talent={item}
        />
      )}
      contentContainerStyle={
        talents.length === 0
          ? styles.emptyList
          : styles.list
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {search.trim()
            ? 'No talents found.'
            : 'No talents available.'}
        </Text>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },

  emptyList: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },

  footer: {
    paddingVertical: 20,
  },
});