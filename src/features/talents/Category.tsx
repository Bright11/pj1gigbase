import { View, Text, StyleSheet, TextInput } from 'react-native';
import { ImageBackground } from 'expo-image';
import CategoryList from './CategoryList';

export default function Category() {
  return (
    <View style={styles.container}>
      {/* Fixed hero */}
      <ImageBackground
        source={require('@/assets/images/pj1gif.gif')}
        style={styles.hero}
        contentFit="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.heading}>Find the right talent</Text>

          <TextInput
            style={styles.search}
            placeholder="Search by category"
            placeholderTextColor="#777"
          />
        </View>
      </ImageBackground>

      {/* Everything below the hero scrolls as one unit */}
      <View style={{ flex: 1 }}>
        <CategoryList />
       
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: '#fff',
  },
  hero: {
    width: '100%',
    height: 210,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heading: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 14,
  },
  search: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});