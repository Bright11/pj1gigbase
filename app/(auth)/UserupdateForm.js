import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { router, useNavigation } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Button from "@/components/botton/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "@/components/firebase/Firebaseconfig";
import { updateDoc, doc } from "firebase/firestore";
import useUserdata from "@/components/getuserdata";
import Changprofilpic from "./Changprofilpic";
import Updatepicinfirebase from "./Updatepicinfirebase";
import { Colors } from "@/constants/Colors";
import { getAuth, updatePassword } from "firebase/auth";
import { SafeAreaView } from "react-native";

export default function UserupdateForm() {
  const navigation = useNavigation();
  const [chosedata, setChosedata] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [number, setNumber] = useState("");
  const [servicetype, setServicetype] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadedimage, setUploadedimage] = useState("");
  const [imagereadyupload, setImagereadyupload] = useState("");
  const [password, setPassword] = useState("");
  const userdata = useUserdata();

  const user = auth?.currentUser;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitleAlign: "center",
      headerRight: () => (
        <View style={style.titletopview}>
          <Text style={style.titletoptext}>Edit profile</Text>
        </View>
      ),
    });
  }, [navigation]);

  const signoutuser = () => {
    if (!user) {
      router.replace("/(tabs)/Home");
    }
  };
  useEffect(() => {
    if (userdata) {
      setName(userdata.username);
      setEmail(userdata.email);
      setNumber(userdata.pnumber);
      setUserId(userdata.userId);
      setServicetype(userdata.servicetype || "");
      setSelectedImage(userdata.userprofile || "");
    }
    signoutuser();
  }, [userdata]);

  const choseservice = () => {
    setChosedata(!chosedata);
  };

  const imcforlient = () => {
    setServicetype("Client");
    setChosedata(!chosedata);
  };

  const imforservice = () => {
    setServicetype("Performer");
    setChosedata(!chosedata);
  };

  const submit = async () => {
    if (!name || !email || !number) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    // if (!emailRegex.test(email)) {
    //     Alert.alert('Validation Error', 'Please enter a valid email address.');
    //     return;
    // }

    // Basic phone number validation (adjust as needed)
    // if (number.length < 10) {
    //     Alert.alert('Validation Error', 'Please enter a valid phone number.');
    //     return;
    // }

    try {
      const postRef = doc(db, "users", userdata?.userId);
      const updateData = {
        username: name,
        pnumber: number,
        email: email,
        servicetype: servicetype,
        // userprofile: selectedImage,
      };
      if (uploadedimage) {
        await updateDoc(postRef, {
          updateData,
          userprofile: uploadedimage,
        });
      } else {
        await updateDoc(postRef, updateData);
      }
      // checking if password is not empty
      if (password !== "") {
        //          const user = auth.currentUser;
        updatePassword(user, password).then(() => {
          // Update successful.
        });
      }

      if (imagereadyupload) {
        await AsyncStorage.multiSet([
          ["username", name],
          ["pnumber", number],
          ["email", email],
          ["servicetype", servicetype],
          ["userprofile", imagereadyupload || ""], // Ensure it's a string
        ]);
      } else {
        await AsyncStorage.multiSet([
          ["username", name],
          ["pnumber", number],
          ["email", email],
          ["servicetype", servicetype],
          ["userprofile", selectedImage || ""], // Ensure it's a string
        ]);
      }

      // empty all
      setName("");
      setEmail("");
      setNumber("");
      setUserId("");
      setServicetype("");
      setSelectedImage(""); // Reset the image selection

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/(tabs)/Profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
      console.error(error);
    }
  };

  // console.log("pro", user?.email)
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
          <Text style={{ textAlign: "center" }}>Enter your information</Text>

          {/* Image Preview */}
          <View style={style.imageContainer}>
            {selectedImage ? (
              <Image
                source={{ uri: selectedImage }}
                style={style.imagePreview}
              />
            ) : (
              <Text style={{ textAlign: "center" }}>No image selected</Text>
            )}
          </View>

          <TextInput
            style={style.input}
            placeholder="Your full name"
            onChangeText={(text) => setName(text)}
            value={name}
          />
          <TextInput
            style={style.input}
            autoComplete="none"
            keyboardType="email-address"
            placeholder="Enter your Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
            editable={false} // Make it non-editable
          />
          <TextInput
            style={style.input}
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            autoComplete="none"
            onChangeText={(text) => setNumber(text)}
            value={number}
          />

          <TextInput
            style={style.input}
            secureTextEntry={true}
            placeholder="New password optional"
            autoComplete="none"
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <View style={style.chosecontainer}>
            <Pressable style={style.choseiconsview} onPress={choseservice}>
              <TextInput
                style={style.input}
                placeholder="Choose service option"
                value={servicetype}
                editable={false} // Make it non-editable
              />
              <MaterialIcons name="arrow-drop-down" size={30} color="black" />
            </Pressable>
            {chosedata && (
              <View style={style.optionstochose}>
                <Pressable style={style.options} onPress={imcforlient}>
                  <Text style={style.optionsText}>Client</Text>
                </Pressable>
                <Pressable style={style.options} onPress={imforservice}>
                  <Text style={style.optionsText}>Performer</Text>
                </Pressable>
              </View>
            )}
          </View>

          <Changprofilpic
            setUploadedimage={setUploadedimage}
            uploadedimage={uploadedimage}
          />

          {uploadedimage && (
            <Updatepicinfirebase
              setUploadedimage={setUploadedimage}
              setImagereadyupload={setImagereadyupload}
              uploadedimage={uploadedimage}
            />
          )}

          <Button onPress={submit} text="Update" />

          <Button
            style={{ marginTop: 20 }}
            text="Back to Home"
            onPress={() => router.replace("/(tabs)/Home")}
          />
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
  },
  chosecontainer: {
    position: "relative",
  },
  optionstochose: {
    position: "absolute",
    top: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 120,
    alignItems: "center",
  },
  options: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 10,
    paddingLeft: 10,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.appcolor.promarycolor,
    width: "90%",
    height: "100%",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    margin: 0,
    paddingRight: 0,
    marginRight: 0,
  },
  titletoptext: {
    fontFamily: "Poppins-extrabold",
    fontSize: 16,
  },
});
