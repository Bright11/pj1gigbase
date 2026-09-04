import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface CategoryCardProps {
  title: string;
  image: string;
}

export default function CategoryCard({
  title,
  image,
}: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={image}
        style={styles.image}
        contentFit="cover"
      />

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: 12,
  },

  image: {
    width: 130,
    height: 100,
    borderRadius: 12,
  },

  title: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
  },
});