import {
  View,
  Pressable,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { router, Stack, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import useUserdata from "@/components/getuserdata";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import CustomBtn from "../../components/headercutombtn/Custombtn";

const Mymessages = () => {
  const navigation = useNavigation();
  const userdata = useUserdata();
  const [messages, setMessages] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async () => {
    try {
      const messagesRef = collection(db, "lastmessage");
      const q = query(
        messagesRef,
        where("toid", "==", userdata?.userId),
        orderBy("timestamp", "desc"),
        limit(10),
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({ id: doc.id, ...doc.data() });
        });

        setMessages(newMessages);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setLoading(false);
      });

      return () => unsubscribe(); // Clean up the listener on component unmount
    } catch (error) {
      Alert.alert("Error", "Check your network");
    }
  };

  const fetchMoreMessages = async () => {
    if (!hasMore) return;

    setLoadingMore(true);
    try {
      const messagesRef = collection(db, "lastmessage");
      const q = query(
        messagesRef,
        where("toid", "==", userdata?.userId),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(10),
      );

      const querySnapshot = await getDocs(q);
      const moreMessages = [];
      querySnapshot.forEach((doc) => {
        moreMessages.push({ id: doc.id, ...doc.data() });
      });

      setMessages((prevMessages) => [...prevMessages, ...moreMessages]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length > 0);
    } catch (error) {
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userdata) {
      fetchMessages();
    }
  }, [userdata]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userdata?.username,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerTitleAlign: "center",

      headerLeft: () => (
        <Pressable onPress={() => router.replace("/(tabs)/profile")}>
          <AntDesign name="arrow-left" size={35} color="black" />
        </Pressable>
      ),
    });
  }, [navigation, userdata?.username]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMoreMessages();
    }
  };
  //console.log(userdata?.userprofile)
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {/* <View style={styles.headercontainer}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/(tabs)/Profile");
          }}
        >
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.headertext}>Messages</Text>
        </TouchableOpacity>
      </View> */}
      <CustomBtn text="Message" link="/(tabs)/Profile" />
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.userItem}
            onPress={() =>
              router.push({
                params: {
                  fromid: item?.toid,
                  tousername: item?.fromusername,
                  toid: item?.fromid,
                },
                pathname: "hidden/Messages",
              })
            }
          >
            <View style={styles.textView}>
              <View>
                {item?.pro ? (
                  <Image
                    style={styles.profileimage}
                    source={{ uri: item?.userprofile }}
                  />
                ) : (
                  <Image
                    style={styles.profileimage}
                    source={require("../../assets/images/avataimage.png")}
                  />
                )}
              </View>
              <View>
                <Text>
                  {item.fromusername.substring(0, 30) || "Unknown User"}
                </Text>
                <Text>{item.content.substring(0, 30) || "Unknown User"}</Text>
              </View>
            </View>
          </Pressable>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
        ListEmptyComponent={!loading && <Text>No messages found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userItem: {
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
  textView: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingRight: 10,
  },
  profileimage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#000",
    borderWidth: 1,
    marginLeft: 10,
  },
  headercontainer: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "white",
    flexDirection: "row",
    padding: 10,
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: "100%",
  },
  headertext: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Mymessages;
