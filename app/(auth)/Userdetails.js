import {
  View,
  Pressable,
  StyleSheet,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { router, useNavigation } from "expo-router";
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
} from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import Entypo from "@expo/vector-icons/Entypo";
import CustomBtn from "../../components/headercutombtn/Custombtn";

const Userdetails = () => {
  const navigation = useNavigation();
  const userdata = useUserdata(); // Get current user's data
  const [users, setUsers] = useState([]); // State for user info
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch users instead of messages

  console.log(userdata?.userId);
  // Fetch more users when scrolling down
  const userinf = [
    {
      id: 1,
      username: userdata?.username,
      profileImage: userdata?.userprofile,
    },
    {
      id: 2,
      username: userdata?.email,
      profileImage: userdata?.userprofile,
    },
    {
      id: 3,
      username: userdata?.servicetype,
      profileImage: userdata?.userprofile,
    },
    {
      id: 4,
      username: userdata?.pnumber,
      profileImage: userdata?.userprofile,
    },
  ];
  useEffect(() => {
    if (userdata) {
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
        <Pressable onPress={() => router.push("/(tabs)/Profile")}>
          <AntDesign name="arrow-left" size={35} color="black" />
        </Pressable>
      ),
    });
  }, [navigation, userdata?.username]);

  return (
    <View style={styles.container}>
      {/* <CustomBtn text="My Info" link="/(tabs)/Profile" /> */}
      <FlatList
        data={userinf}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <>
            <Pressable style={styles.userItem}>
              <View style={styles.textView}>
                <View>
                  {item?.profileImage ? (
                    <Image
                      style={styles.profileImage}
                      source={{ uri: item?.profileImage }}
                    />
                  ) : (
                    <Image
                      style={styles.profileImage}
                      source={require("../../assets/images/avataimage.png")}
                    />
                  )}
                </View>
                <View>
                  <Text>{item.username || "Unknown User"}</Text>
                </View>
              </View>
            </Pressable>
          </>
        )}
      />
      <Pressable
        style={styles.userudatebtn}
        onPress={() => router.push("/UserupdateForm")}
      >
        <Text>Update</Text>
      </Pressable>

      <Pressable
        style={[styles.userudatebtn, { backgroundColor: "red" }]}
        onPress={() => router.push("/Deleteaccount")}
      >
        <Text style={{ color: "white" }}>
          Delete Account <Entypo name="trash" size={24} color="white" />
        </Text>
      </Pressable>
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: "#000",
    borderWidth: 1,
    marginLeft: 10,
  },
  userudatebtn: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    alignItems: "center",
    alignSelf: "center",
    gap: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
    width: "100%",
    marginBottom: 50,
  },
});

export default Userdetails;
