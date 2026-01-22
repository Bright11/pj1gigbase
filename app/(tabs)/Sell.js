import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/components/firebase/Firebaseconfig";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import Advertcategory from "../hidden/Advertcategory";
import Button from "@/components/botton/Button";
import Myregion from "../hidden/Myregion";
import ChoseVideoFromDevice from "@/components/ChoseVideoFromDevice";
import ImagePickerComponent from "@/components/ImagePickerComponent";
import SaveImageToFirebase from "@/components/SaveImageToFirebase";
import SaveVideoToFirebase from "@/components/SaveVideoToFirebase";
import useUserdata from "@/components/getuserdata";
import AntDesign from "@expo/vector-icons/AntDesign";

import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Sell = () => {
  const { postId } = useLocalSearchParams(); // Post ID passed via the route
  const [title, setTitle] = useState("");
  const [categoryName, setCategoryName] = useState(""); // State for the category
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [selectedVideo, setSelectedVideo] = useState();
  const [newpostid, setNewpostid] = useState(postId || "");
  const [opencategory, setOpencategory] = useState(false); // Toggle state for Advertcategory
  const [openregion, setOpenregion] = useState(false);
  const [openvideo, setOpenvideo] = useState(false);
  const [takepicture, setTakepicture] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newSelectedImages, setNewSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [enablesubmitbtn, setEnablebtn] = useState(false);

  const userdata = useUserdata();
  const navigation = useNavigation();

  // Setup navigation options in useEffect
  // useEffect(() => {
  //   navigation.setOptions({
  //     title: "Add Post ",
  //     headerTitleAlign: "center",
  //     headerTitleStyle: { fontWeight: "bold" },
  //     headerLeft: () => (
  //       <TouchableOpacity
  //         onPress={() => {
  //           router.replace("/(tabs)/Profile");
  //           // router.replace("/");
  //         }}
  //       >
  //         <AntDesign name="arrow-left" size={24} color="black" />
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  const chooseCategory = () => {
    setOpencategory(true); // Open the category selection component
  };

  const choseLocation = () => {
    setOpenregion(true);
  };

  const choseVideo = () => {
    setOpenvideo(true);
  };

  const takePicture = () => {
    setTakepicture(true);
  };

  const savepost = async () => {
    if (
      !title ||
      !categoryName ||
      !region ||
      !description ||
      newSelectedImages.length === 0
    ) {
      Alert.alert("Please fill all required fields");
      return;
    }
    setLoading(true); // Start loading
    try {
      if (selectedVideo) {
        const docRef = await addDoc(collection(db, "post"), {
          title,
          description,
          location: region, // Use region instead of location
          image: selectedImages[0], // Assuming the first image is the main image
          video: selectedVideo, // Use the selected video URL
          catId: categoryName,
          userId: userdata?.userId,
          ownername: userdata?.username,
          number: userdata?.pnumber,
          servicetype: userdata?.servicetype,
          images: selectedImages,
          favorite: 0,
          createdAt: new Date(), // Optional: Adding a timestamp
        });
      } else {
        const docRef = await addDoc(collection(db, "post"), {
          title,
          description,
          location: region, // Use region instead of location
          image: selectedImages[0], // Assuming the first image is the main image
          // video: selectedVideo, // Use the selected video URL
          catId: categoryName,
          userId: userdata?.userId,
          ownername: userdata?.username,
          number: userdata?.pnumber,
          servicetype: userdata?.servicetype,
          images: selectedImages,
          favorite: 0,
          createdAt: new Date(), // Optional: Adding a timestamp
        });
      }

      Alert.alert("Success", "Your post has been saved successfully.");
      // Reset all fields
      setTitle("");
      setCategoryName("");
      setRegion("");
      setDescription("");
      setSelectedImages([]);
      setNewSelectedImages([]);
      setSelectedVideo(null);
      setOpencategory(false);
      setOpenregion(false);
      setOpenvideo(false);
      setTakepicture(false);
      router.replace("../(tabs)/Mypost");
    } catch (error) {
      Alert.alert("Error", "There was an issue saving your post.");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  //console.log(selectedImages)
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerBackVisible: false, // High-level "hide"
          headerLeft: () => null, // Manual override (most powerful)
          headerBackTitleVisible: false, // Specific for iOS "Back" textappear
          title: "Saved Items", // Optional: keep or change the title
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
          <Text style={styles.headertext}>Post Add</Text>
        </TouchableOpacity>
      </View> */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* <ScrollView style={styles.scrollContainer}> */}
          {opencategory ? (
            <Advertcategory
              setCategoryName={(name) => setCategoryName(name)} // Set the selected category
              setOpencategory={setOpencategory} // Close the Advertcategory when a category is selected
            />
          ) : openregion ? (
            <Myregion setRegion={setRegion} setOpenregion={setOpenregion} />
          ) : (
            <>
              <TouchableOpacity style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Services, Eg:Durmmer"
                  placeholderTextColor="black"
                  value={title}
                  onChangeText={setTitle}
                />
              </TouchableOpacity>

              {/* Category selection */}
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={chooseCategory}
              >
                <Text style={styles.textInput}>
                  {categoryName || "Choose Category"}
                </Text>
              </TouchableOpacity>

              {/* Region selection */}
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={choseLocation}
              >
                <Text style={styles.textInput}>
                  {region || "Choose Region"}
                </Text>
              </TouchableOpacity>

              {/* Description input */}
              <TouchableOpacity style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  multiline
                  onChangeText={setDescription}
                  placeholder="Description"
                  placeholderTextColor="black"
                />
              </TouchableOpacity>

              {/* Image and Video picker components */}
              <ImagePickerComponent
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />
              {!newSelectedImages.length > 0 && (
                <ChoseVideoFromDevice
                  selectedVideo={selectedVideo}
                  setSelectedVideo={setSelectedVideo}
                />
              )}

              {/* Display the Save buttons */}
              <SaveVideoToFirebase
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
              />
              <SaveImageToFirebase
                setNewSelectedImages={setNewSelectedImages}
                newSelectedImages={newSelectedImages}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />

              {/* Complete button */}
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  {categoryName &&
                  region &&
                  title &&
                  description &&
                  newSelectedImages.length > 0 ? (
                    <Button text="Press to Complete" onPress={savepost} />
                  ) : (
                    <Button
                      text={
                        selectedImages.length > 0
                          ? "Press above button to continue"
                          : "Fill all forms"
                      }
                      onPress={() =>
                        Alert.alert(
                          selectedImages.length > 0
                            ? "Press above button to continue"
                            : "Please fill all required fields",
                        )
                      }
                      disabled
                    />
                  )}
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Sell;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 30,
  },
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
  inputContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "white",
  },
  textInput: {
    fontSize: 16,
    color: "black",
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
