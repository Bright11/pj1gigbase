import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

import { router, useNavigation } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth, db } from "@/components/firebase/Firebaseconfig";
import useUserdata from "@/components/getuserdata";
import { MaterialIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import * as Updates from "expo-updates";

const Profile = () => {
  const navigation = useNavigation();
  const userdata = useUserdata();
  const [islogout, setIslogout] = useState(false);
  // console.log(userdata?.userprofile)

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      title: "Profile",
      headerRight: () => (
        <View style={style.topbarview}>
          <Pressable style={{ marginRight: 16 }}>
            <MaterialIcons name="settings" size={24} color="black" />
          </Pressable>

          <Pressable>
            {userdata ? (
              <>
                {userdata.userprofile ? (
                  <Image
                    style={style.logoimage}
                    source={{ uri: userdata?.userprofile }}
                  />
                ) : (
                  <Image
                    style={style.logoimage}
                    source={require("../../assets/images/pjlogo.jpeg")}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </Pressable>
        </View>
      ),
    });
  });

  const signoutuser = useCallback(async () => {
    const user = auth?.currentUser;

    // If user exists in Firestore, update their logged-in status
    if (user) {
      const postRef = doc(db, "users", user.uid);
      await updateDoc(postRef, { isloggedin: false });
    }

    // Proceed with Firebase Auth sign out
    try {
      await signOut(auth);
      console.log("yes");

      // Clear AsyncStorage
      await AsyncStorage.multiRemove([
        "islogedin",
        "username",
        "userId",
        "pnumber",
        "email",
        "servicetype",
        "userprofile",
      ]);

      // Reload the app
      router.push("/(auth)/login");
      // await Updates.reloadAsync();
    } catch (error) {
      // Handle any errors during sign-out
      Alert.alert("Error", "An error occurred while signing out.");
    }
  }, []);

  //   useEffect(() => {
  //     if (islogout) {
  //         router.replace("/(tabs)/Home");
  //     }
  // }, [islogout]);

  return (
    <ScrollView style={{ flex: 1 }}>
      <Text style={{ alignSelf: "center" }}>{userdata?.username}</Text>
      <View style={style.container}>
        {/* <Tabs.Screen options={{
    tabBarStyle: {backgroundColor: 'white'},
    tabBarIconStyle: {color: 'black'},
    tabBarActiveTintColor: '#333',
    tabBarInactiveTintColor: '#666',
  
}}
/> */}
        <Pressable
          style={style.itemviews}
          onPress={() => router.replace("./Sell")}
        >
          <View style={style.iconsview}>
            <MaterialCommunityIcons name="post" size={24} color="black" />
            <Text>Add post</Text>
          </View>
        </Pressable>
        <Pressable
          style={style.itemviews}
          onPress={() => router.replace("hidden/Mypost")}
        >
          <View style={style.iconsview}>
            <MaterialCommunityIcons name="post" size={24} color="black" />
            <Text>My Post</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.replace("hidden/mymessages")}
          style={style.itemviews}
        >
          <View style={style.iconsview}>
            <Entypo name="message" size={24} color="black" />
            <Text>Messages</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => router.push("hidden/Saved")}
          style={style.itemviews}
        >
          <View style={style.iconsview}>
            <AntDesign name="save" size={24} color="black" />
            <Text>Saved Post</Text>
          </View>
        </Pressable>

        <Pressable
          style={style.itemviews}
          onPress={() => router.replace("../(auth)/Userdetails")}
        >
          <View style={style.iconsview}>
            <FontAwesome5 name="clipboard-check" size={24} color="black" />
            <Text>My Info</Text>
          </View>
        </Pressable>
        <Pressable style={style.itemviews}>
          <View style={style.iconsview}>
            <MaterialIcons name="feedback" size={24} color="black" />
            <Text>Feedback</Text>
          </View>
        </Pressable>
        <Pressable style={style.itemviews}>
          <View style={style.iconsview}>
            <SimpleLineIcons name="user-follow" size={24} color="black" />
            <Text>Followers</Text>
          </View>
        </Pressable>
        <Pressable style={style.itemviews}>
          <View style={style.iconsview}>
            <Ionicons name="help" size={24} color="black" />
            <Text>Request help</Text>
          </View>
        </Pressable>
        <Pressable style={style.itemviews} onPress={signoutuser}>
          <View style={style.iconsview}>
            <AntDesign name="logout" size={24} color="black" />
            <Text>Log Out</Text>
          </View>
        </Pressable>

        <Pressable
          style={style.itemviews}
          onPress={() => router.replace("hidden/Userbio")}
        >
          <View style={style.iconsview}>
            <MaterialCommunityIcons name="bio" size={24} color="black" />
            <Text>Bio update</Text>
          </View>
        </Pressable>

        {/* <Pressable
          style={style.itemviews}
          onPress={() => router.replace("./Sell")}
        >
          <View style={style.iconsview}>
            <Ionicons name="add-circle-sharp" size={24} color="black" />
            <Text>Post Add</Text>
          </View>
        </Pressable> */}
      </View>
    </ScrollView>
  );
};

export default Profile;

const style = StyleSheet.create({
  logoimage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    resizeMode: "contain",
  },
  topbarview: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally         // Ensure it takes full height of the
    width: 350,
    height: "100%",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    margin: 0,
    paddingRight: 0, // Remove padding/margin from the right container
    marginRight: 0,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  container: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    flex: 1,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  itemviews: {
    width: 150,
    height: 80,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    flexDirection: "column",
    padding: 10,
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconsview: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textnumbers: {
    textAlign: "center",
    marginTop: 8,
  },
});
