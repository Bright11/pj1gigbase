import { View, Text, FlatList, Pressable, Image, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '@/constants/Colors';
import Feather from '@expo/vector-icons/Feather';
import { collection, query, orderBy, limit, startAfter, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/Firebaseconfig';
import { router } from 'expo-router';
import PhoneNumber from './Number/PhoneNumber';

const Servicescomponet = () => {
  const [post, setPost] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // Track the last fetched document
  const [loading, setLoading] = useState(false); // Loading state for images
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for pagination
  const [hasMore, setHasMore] = useState(true); // Flag to check if there's more data to load

  const PAGE_SIZE = 10; // Number of items to load per batch

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = (loadMore = false) => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    const postsRef = collection(db, "post");
    let q = query(postsRef, orderBy('createdAt', 'desc'), limit(PAGE_SIZE));

    if (loadMore && lastDoc) {
      q = query(postsRef, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(PAGE_SIZE));
    }

    onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }
      
      const newPosts = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      setPost(prevPosts => loadMore ? [...prevPosts, ...newPosts] : newPosts);
      setLoadingMore(false);
    }, (error) => {
      console.error("Error fetching posts: ", error);
      setLoadingMore(false);
    });
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(true);
    }
  };

//   const makePhoneCall = (phoneNumber) => {
//     Linking.openURL(`tel:${phoneNumber}`).catch((err) =>
//       console.error('Error making phone call', err)
//     );
//   };

  return (
    <View>
      <FlatList
        data={post}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={style.usersadditems}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/Servicedetails',
                params: {
                  itemid: item.id,
                },
              })
            }
          >
            <View style={style.servicesimageview}>
              {item.image ? (
                <>
                  <Image
                    source={{ uri: item.image }}
                    style={style.servicesimage}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                  />
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color={Colors.appcolor.begreen}
                      style={style.loadingIndicator}
                    />
                  )}
                </>
              ) : (
                <Text style={style.errorText}>Image not available</Text>
              )}
            </View>
            <View style={style.services_textview}>
                <Text>View Service</Text>
              <Text>Contact for price</Text>
              <Text style={style.pricetext}>{item.location}</Text>
              <Text numberOfLines={2}>{item.title}</Text>
             <PhoneNumber mynumber={item.number} btncolor={{backgroundColor:Colors.appcolor.begreen}}/>
            </View>
          </Pressable>
        )}
        onEndReached={handleLoadMore} // Load more data when the user scrolls to the bottom
        onEndReachedThreshold={0.5} // Trigger `onEndReached` when the user is halfway down the list
        ListFooterComponent={
          loadingMore ? <ActivityIndicator size="large" color={Colors.appcolor.begreen} /> : null
        }
      />
    </View>
  );
};

const style = StyleSheet.create({
  usersadditems: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'space-between',
  },
  servicesimageview: {
    width: "40%",
    maxHeight: 150,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesimage: {
    width: "100%",
    height: "100%",
    objectFit: 'cover',
    resizeMode: 'contain',
  },
  loadingIndicator: {
    position: 'absolute',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  services_textview: {
    width: "60%",
  },
  pricetext: {
    color: Colors.appcolor.begreen,
  },
  
});

export default Servicescomponet;
