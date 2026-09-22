
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Mycolors } from '@/constants/mycolors';
import PublicTalentList from '@/utils/PublicTalentList';
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ServiceScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');
   

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Debounced search:', search);
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search talents..."
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.listContainer}>
        <PublicTalentList
          search={debouncedSearch}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    marginTop: 40,
    
  },

  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    backgroundColor: '#F3F4F6',
    borderColor:Mycolors.secondarycolor,
    borderWidth: 1,
  },

  listContainer: {
    flex: 1,
  },
});

