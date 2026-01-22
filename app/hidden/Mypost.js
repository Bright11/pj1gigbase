import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import useUserdata from "@/components/getuserdata";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigation, useRouter } from "expo-router"; // Assuming you're using expo-router
import { db } from "@/components/firebase/Firebaseconfig";
import PhoneNumber from "@/components/homecomponets/Number/PhoneNumber";
import { Colors } from "@/constants/Colors";
import Button from "@/components/botton/Button";
import { AntDesign } from "@expo/vector-icons";
import CustomBtn from "@/components/headercutombtn/Custombtn";

const Mypost = () => {
  const userdata = useUserdata();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      title: "My Posts",
      headerTitleAlign: "center",
      headerTitleStyle: { fontWeight: "bold" },
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.replace("/(tabs)/Profile")}>
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchPosts = () => {
    setLoading(true);
    try {
      const q1 = query(
        collection(db, "post"),
        where("userId", "==", userdata?.userId),
      );
      const unsubscribe = onSnapshot(q1, (querySnapshot1) => {
        const searchResults = [];
        querySnapshot1.forEach((doc) => {
          searchResults.push({ id: doc.id, ...doc.data() });
        });
        setPost(searchResults);
        setLoading(false);
      });

      // Cleanup listener on component unmount
      return () => unsubscribe();
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userdata?.userId) {
      fetchPosts();
    }
  }, [userdata?.userId]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Implement load more logic here, e.g., paginating Firestore queries
    setLoadingMore(false);
  };

  const deletedata = async (itemid) => {
    // Implement delete logic here
    // confirm before delete
    // const q1 = query(collection(db, "post"), where("id", "==", itemid));
    // const querySnapshot = await getDocs(q1);
    // querySnapshot.forEach((doc) => {
    //   doc.ref.delete();
    // });
    await deleteDoc(doc(db, "post", itemid));
    Alert.alert("Post Deleted Successfully");
  };

  return (
    <View style={styles.container}>
      <CustomBtn text="My Post" link="/(tabs)/Profile" />
      {loading ? (
        <ActivityIndicator size="large" color={Colors.appcolor.begreen} />
      ) : post.length === 0 ? (
        <Text style={styles.noPostsText}>No posts available</Text>
      ) : (
        <FlatList
          data={post}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable style={styles.usersadditems}>
              <View style={styles.servicesimageview}>
                {item.image ? (
                  <>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.servicesimage}
                      onLoadStart={() => setImageLoading(true)}
                      onLoadEnd={() => setImageLoading(false)}
                    />
                    {imageLoading && (
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
                <PhoneNumber
                  mynumber={item.number}
                  btncolor={{ backgroundColor: Colors.appcolor.begreen }}
                />
                <Text style={styles.pricetext}>{item.location}</Text>
                <Text>{item.title}</Text>
                <Button
                  text="Edit"
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/Editpost",
                      params: { postId: item?.id },
                    })
                  }
                />

                <Button text="Delete" onPress={() => deletedata(item?.id)} />
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  noPostsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: Colors.appcolor.begreen,
  },
});

export default Mypost;
