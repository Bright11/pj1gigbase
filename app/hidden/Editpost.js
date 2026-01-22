import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  Text,
} from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "@/components/firebase/Firebaseconfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Advertcategory from "./Advertcategory";
import Button from "@/components/botton/Button";
import Myregion from "./Myregion";
import ChoseVideoFromDevice from "@/components/ChoseVideoFromDevice";
import ImagePickerComponent from "@/components/ImagePickerComponent";
import SaveImageToFirebase from "@/components/SaveImageToFirebase";
import SaveVideoToFirebase from "@/components/SaveVideoToFirebase";
import useUserdata from "@/components/getuserdata";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";

const Editpost = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState({
    title: "",
    categoryName: "",
    region: "",
    description: "",
  });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [newSelectedImages, setNewSelectedImages] = useState([]);
  const [openCategory, setCategoryOpen] = useState(false);
  const [openRegion, setRegionOpen] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openImagePicker, setOpenImagePicker] = useState(false);

  const userdata = useUserdata();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleStyle: { fontWeight: "bold" },

      headerLeft: () => (
        <Pressable onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={35} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (postId) {
      fetchPostData(postId);
    }
  }, [postId]);

  const fetchPostData = async (postId) => {
    try {
      const postRef = doc(db, "post", postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const postData = postDoc.data();
        setPost({
          title: postData.title,
          categoryName: postData.catId,
          region: postData.location,
          description: postData.description,
        });
      } else {
      }
    } catch (error) {}
  };

  const handleSave = async () => {
    try {
      const postRef = doc(db, "post", postId);
      const updateData = {
        ...post,
        userId: userdata?.userId,
        ownername: userdata?.username,
        number: userdata?.pnumber,
        servicetype: userdata?.servicetype,
      };

      if (newSelectedImages.length > 0) {
        updateData.images = selectedImages;
        updateData.image = selectedImages[0];
      }

      if (selectedVideo) {
        updateData.video = selectedVideo;
      }

      await updateDoc(postRef, updateData);
      Alert.alert("Success", "Post updated successfully!");
      // clear all usesate
      setNewSelectedImages([]);
      setSelectedImages([]);
      setSelectedVideo(null);
      setOpenVideo(false);
      setOpenImagePicker(false);
      router.replace("/(tabs)/Mypost");
    } catch (error) {
      Alert.alert("Error", "Failed to update the post.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {openCategory ? (
            <Advertcategory
              setCategoryName={(name) =>
                setPost((prev) => ({ ...prev, categoryName: name }))
              }
              setOpencategory={setCategoryOpen}
            />
          ) : openRegion ? (
            <Myregion
              setRegion={(region) => setPost((prev) => ({ ...prev, region }))}
              setOpenregion={setRegionOpen}
            />
          ) : (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Title"
                  value={post.title}
                  onChangeText={(title) =>
                    setPost((prev) => ({ ...prev, title }))
                  }
                />
              </View>

              {/* Touchable area for selecting category */}
              <TouchableOpacity onPress={() => setCategoryOpen(true)}>
                <View style={styles.selectContainer}>
                  <Text style={styles.selectText}>
                    {post.categoryName || "Select Category"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Touchable area for selecting region */}
              <TouchableOpacity onPress={() => setRegionOpen(true)}>
                <View style={styles.selectContainer}>
                  <Text style={styles.selectText}>
                    {post.region || "Select Region"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Description"
                  value={post.description}
                  multiline
                  onChangeText={(description) =>
                    setPost((prev) => ({ ...prev, description }))
                  }
                />
              </View>

              {openImagePicker && (
                <ImagePickerComponent
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                />
              )}

              <Text style={{ textAlign: "center" }}>Change Video</Text>
              <ChoseVideoFromDevice
                setOpenvideo={setOpenVideo}
                setSelectedVideo={setSelectedVideo}
                selectedVideo={selectedVideo}
              />

              {selectedImages.length === 0 && (
                <Button
                  text="Change Images"
                  onPress={() => setOpenImagePicker(true)}
                />
              )}

              {/* {!selectedVideo && <Button text="Change  Video" onPress={() => setOpenVideo(true)} />} */}

              <SaveImageToFirebase
                setNewSelectedImages={setNewSelectedImages}
                newSelectedImages={newSelectedImages}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
              />

              <SaveVideoToFirebase
                selectedVideo={selectedVideo}
                setSelectedVideo={setSelectedVideo}
              />

              <Button text="Save" onPress={handleSave} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Editpost;

const styles = StyleSheet.create({
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
  selectContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "white",
  },
  selectText: {
    fontSize: 16,
    color: "black",
  },
});
