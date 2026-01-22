import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import Button from "../../components/botton/Button";
import { router, Stack, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/components/firebase/Firebaseconfig";
import CustomBtn from "../../components/headercutombtn/Custombtn";

const Userbio = () => {
  const [userbio, setUserbio] = useState("");
  const navigation = useNavigation();
  const user = auth?.currentUser;

  useEffect(() => {
    // Set up navigation options
    // navigation.setOptions({
    //   title: "Bio update",
    //   headerTitleAlign: "center",
    //   headerTitleStyle: { fontWeight: "bold" },
    //   headerLeft: () => (
    //     <TouchableOpacity onPress={() => router.back()}>
    //       <AntDesign name="arrow-left" size={34} color="black" />
    //     </TouchableOpacity>
    //   ),
    // });

    // Redirect to login if user is not logged in
    if (!user) {
      router.replace("/(auth)/login");
    } else {
      // Fetch existing bio if user is logged in
      const fetchBio = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserbio(docSnap.data().userbio || ""); // Set bio if it exists
          }
        } catch (error) {
          console.error("Error fetching bio:", error);
          alert("Failed to load bio. Please try again.");
        }
      };

      fetchBio();
    }
  }, [navigation, user]);

  const handleSave = async () => {
    if (!userbio) {
      alert("Please enter your bio");
      return;
    }

    try {
      const postRef = doc(db, "users", user.uid);
      await updateDoc(postRef, { userbio });
      alert("Bio updated successfully");
      router.replace("/(tabs)/Profile");
    } catch (error) {
      // console.error("Error updating bio:", error);
      alert("Failed to update bio. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <CustomBtn text="Update Bio" link="/(tabs)/Profile" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={styles.keyboardAvoidingViewContainer}
      >
        <View style={styles.bioContainer}>
          <Text style={{ textAlign: "center" }}>Update Your Bio</Text>
          <TextInput
            value={userbio}
            onChangeText={setUserbio}
            style={styles.inputText}
            multiline
          />
          <Button
            style={{ marginTop: 20, fontSize: 20 }}
            onPress={handleSave}
            text="Save"
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
};

export default Userbio;

const styles = StyleSheet.create({
  keyboardAvoidingViewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bioContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  inputText: {
    width: "100%",
    height: 150,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
