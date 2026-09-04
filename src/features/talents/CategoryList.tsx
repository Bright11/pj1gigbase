import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Datacategory } from './categories.data';
import { getcategories } from '@/services/category.service';
import { useEffect, useState } from 'react';
import { Category } from '@/types/category';


export default function CategoryList() {
//     const Datacategory = [
//   {
//     id: 1,
//     title: 'Music',
//     image: 'https://picsum.photos/seed/music/400/300',
//   },
//   {
//     id: 2,
//     title: 'Dance',
//     image: 'https://picsum.photos/seed/dance/400/300',
//   },
//   {
//     id: 3,
//     title: 'Comedy',
//     image: 'https://picsum.photos/seed/comedy/400/300',
//   },
//   {
//     id: 4,
//     title: 'Photography',
//     image: 'https://picsum.photos/seed/photo/400/300',
//   },
//   {
//     id: 5,
//     title: 'MC',
//     image: 'https://picsum.photos/seed/mc/400/300',
//   },

//    {
//     id: 6,
//     title: 'Music',
//     image: 'https://picsum.photos/seed/music/500/500',
//   },
//   {
//     id: 7,
//     title: 'Dance',
//     image: 'https://picsum.photos/seed/dance/500/500',
//   },
//   {
//     id: 8,
//     title: 'Comedy',
//     image: 'https://picsum.photos/seed/comedy/500/500',
//   },
//   {
//     id: 9,
//     title: 'Photography',
//     image: 'https://picsum.photos/seed/photography/500/500',
//   },
//   {
//     id: 10,
//     title: 'DJ',
//     image: 'https://picsum.photos/seed/dj/500/500',
//   },
//   {
//     id: 13,
//     title: 'MC',
//     image: 'https://picsum.photos/seed/mc/500/500',
//   },

//   {
//     id: 14,
//     title: 'DJ',
//     image: 'https://picsum.photos/seed/dj/500/500',
//   },
//   {
//     id: 15,
//     title: 'MC',
//     image: 'https://picsum.photos/seed/mc/500/500',
//   },
// ];
    console.log("data", Datacategory.length)
    const [categories,setCategories]=useState<Category[]>([]);
    const [isloading,setIsloading] = useState(true)
    const [error,setErro] = useState<string |null>(null)

    useEffect(()=>{
      const loadCategories = async()=>{
        try{
          setIsloading(true)
          setErro(null)
          const data = await getcategories();
          setCategories(data)
          
        }catch(error){
          console.log("Failed to load categories", error)
          setErro("Unable to load categories")
        }finally{
          setIsloading(false)
        }
      }
      loadCategories()
    },[])
    if(isloading){
      return(
        <View>
          <ActivityIndicator size="large"/>
        </View>
      )
    }

    if(error){
      <View style={styles.center}>
        <Text>Please check your internet connection or refresh the app</Text>
      </View>
    }
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>Categories</Text>
      

      <View style={styles.grid}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={styles.card}
            onPress={() => {
              console.log('Selected category:', category);
            }}
          >
            <Image
               source={{ uri: category.image }}
              style={styles.cardImage}
              contentFit="cover"
            />
            <Text style={styles.cardTitle}>{category.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
  padding: 16,
  paddingBottom: 30,
  backgroundColor: '#fff',
  borderWidth: 3,
  borderColor: 'lime',
},
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '31%',
    marginBottom: 18,
  },
  cardImage: {
  width: '100%',
  height: 100,
  borderRadius: 12,
  backgroundColor: '#eee',
},
  cardTitle: {
    marginTop: 7,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  center:{
    paddingVertical:30,
    alignItems:'center',
    justifyContent:'center'
  }
});