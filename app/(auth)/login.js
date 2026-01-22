import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";

import { Link, router, useNavigation } from "expo-router";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "@/components/botton/Button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/components/firebase/Firebaseconfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
// import { SafeAreaView } from 'react-native';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getuserdata, setGetuserdata] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "center",

      headerRight: () => (
        <View style={style.titletopview}>
          <Text style={style.titletoptext}>Login In</Text>
        </View>
      ),
    });
  }, [navigation]);
  const register = () => {
    router.push("./signup");
  };
  const login = async () => {
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("User signed in:", user.uid);

      // Reference to the Firestore document
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      console.log("Document snapshot:", docSnap); // Log the entire document snapshot

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("User data from Firestore:", data);
        console.log("User data from username:", data.username);
        // Save user data to AsyncStorage
        await AsyncStorage.multiSet([
          ["islogedin", JSON.stringify(true)],
          ["username", data.username || ""],
          ["userId", user.uid],
          ["pnumber", data.pnumber || ""],
          ["email", data.email || ""],
          ["servicetype", data.servicetype || ""],
          ["userprofile", data.userprofile || ""],
        ]);
        const postRef = doc(db, "users", user.uid);
        await updateDoc(postRef, {
          isloggedin: true,
        });

        // Navigate to Home
        router.replace("/(tabs)/Home");
      } else {
        console.log("No such document!"); // If the document does not exist
        Alert.alert("Error", "No such user data found in Firestore.");
      }
    } catch (error) {
      console.error("Error signing in or fetching user data: ");
      Alert.alert("Error", "Email or Password Error, Try again");
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={style.logoview}>
            <Image
              style={style.logoimage}
              source={require("../../assets/images/pjlogo.jpeg")}
            />
          </View>
          <Text style={{ textAlign: "center" }}>Login information</Text>

          <TextInput
            style={style.input}
            keyboardType="email-address"
            placeholder="Enter your Email"
            onChangeText={(email) => setEmail(email)}
          />
          <TextInput
            style={style.input}
            secureTextEntry={true}
            placeholder="Enter your password"
            onChangeText={(password) => setPassword(password)}
          />

          <Button onPress={login} text="Login" />
          <Pressable
            onPress={register}
            style={{ color: Colors.appcolor.promarycolor }}
          >
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              Don't have an account?{" "}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/(tabs)/Home")}
            style={{ color: Colors.appcolor.promarycolor }}
          >
            <Text style={{ textAlign: "center", marginTop: 8 }}>
              Go to Home{" "}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const style = StyleSheet.create({
  container: {
    flex: 1, // Add this
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
    elevation: 5,
    // Remove marginBottom:100 and paddingBottom:100
  },
  input: {
    width: "90%",
    fontFamily: "Poppins-extrabold",
    fontWeight: "700",
    fontSize: 18,
    borderWidth: 1,
    padding: 8,
    marginTop: 5,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginBottom: 30,
  },

  logoview: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 1,
    paddingHorizontal: 1,
    backgroundColor: Colors.appcolor.promarycolor,
    borderRadius: 50,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginLeft: "auto",
    marginRight: "auto",
  },
  logoimage: {
    width: 100,
    height: 100,

    justifyContent: "center",
    borderRadius: 50,
  },
  chosecontainer: {
    position: "relative",
  },
  optionstochose: {
    position: "absolute",
    top: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    zIndex: 120,
  },
  options: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: Colors.appcolor.promarycolor,
    marginRight: 15,
  },
  optionsText: {
    color: Colors.appcolor.textblack,
    fontWeight: "700",
    fontSize: 18,
  },
  choseiconsview: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titletopview: {
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally         // Ensure it takes full height of the header
    backgroundColor: Colors.appcolor.promarycolor,
    width: "80%",
    height: "100%",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    marginLeft: "auto",
    paddingRight: 0, // Remove padding/margin from the right container
    marginRight: "auto",
  },
  titletoptext: {
    fontFamily: "Poppins-extrabold",
    fontSize: 16,
  },
});
