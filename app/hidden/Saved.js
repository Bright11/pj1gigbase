import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import {
  collection,
  query,
  where,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import { Colors } from "@/constants/Colors";
import useUserdata from "@/components/getuserdata";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomBtn from "../../components/headercutombtn/Custombtn";
const Saved = () => {
  const PAGE_SIZE = 10;
  const [post, setPost] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // Initialize as false to prevent immediate spinner
  const navigation = useNavigation();

  const userdata = useUserdata();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Saved Services",
      headerTitleAlign: "center",
      headerStyle: {
        // backgroundColor: Colors.appcolor.begreen,
      },
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="arrow-back" size={34} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchPosts = async (loadMore = false) => {
    if (loadMore && !hasMore) return;

    setLoadingMore(true);
    try {
      if (!userdata?.userId) {
        setLoadingMore(false);
        return;
      }
      const getsavepost = collection(db, "savedpost");
      let querysavedpost = query(
        getsavepost,
        where("myId", "==", userdata.userId),
      );

      if (lastDoc) {
        querysavedpost = query(querysavedpost, startAfter(lastDoc));
      }

      const savedposts = await getDocs(querysavedpost);
      const newPosts = savedposts.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPost((prevPosts) => [...prevPosts, ...newPosts]);
      setLastDoc(savedposts.docs[savedposts.docs.length - 1]);

      if (savedposts.docs.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setLoadingMore(false);
    } catch (error) {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userdata?.userId) {
      fetchPosts();
    }
  }, [userdata?.userId]); // Ensures fetchPosts runs when userId changes

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(true);
    }
  };

  return (
    <View style={styles.container}>
      <CustomBtn text="Saved Post" link="/(tabs)/Profile" />
      <FlatList
        data={post}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.usersadditems}
            onPress={() =>
              router.push({
                pathname: "hidden/Servicedetails",
                params: {
                  itemid: item.postId,
                },
              })
            }
          >
            <View style={styles.servicesimageview}>
              {item.image ? (
                <>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.servicesimage}
                    onLoadStart={() => setLoading(true)}
                    onLoadEnd={() => setLoading(false)}
                  />
                  {loading && (
                    <ActivityIndicator
                      size="small"
                      color={Colors.appcolor.begreen}
                      style={styles.loadingIndicator}
                    />
                  )}
                </>
              ) : (
                <Text style={styles.errorText}>Image not available</Text>
              )}
            </View>
            <View style={styles.services_textview}>
              <Text>View Service</Text>
              <Text>Contact for price</Text>
              <Text style={styles.pricetext}>{item.location}</Text>
              <Text>{item.title}</Text>
              {/* Assuming PhoneNumber is another component */}
            </View>
          </Pressable>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color={Colors.appcolor.begreen} />
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  usersadditems: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "space-between",
  },
  servicesimageview: {
    width: "40%",
    maxHeight: 150,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  servicesimage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    resizeMode: "contain",
  },
  loadingIndicator: {
    position: "absolute",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  services_textview: {
    width: "60%",
  },
  pricetext: {
    color: Colors.appcolor.begreen,
  },
});

export default Saved;
