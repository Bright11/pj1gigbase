
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { Mycolors } from '@/constants/mycolors';
import PublicTalentList from '@/utils/PublicTalentList';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';


export default function ServiceScreen() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] =
    useState('');
    const {category} = useLocalSearchParams<{ category?: string }>();

    console.log('Category from params:', category);
   

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Debounced search:', search);
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
       <StatusBar style="auto" />
    <View style={styles.container}>
      
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
         category={category}
          search={debouncedSearch}
        />
      </View>
    </View>
    </SafeAreaView>
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

