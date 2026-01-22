import { StyleSheet, View, Button, Text } from 'react-native';
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { storage } from '@/components/firebase/Firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SaveImageToFirebase = (props) => {
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploading, setUploading] = useState(false); // Track uploading state
  const [uploadComplete, setUploadComplete] = useState(false); // Track if upload is done
  const { selectedImages, setSelectedImages, setNewSelectedImages } = props;

  const saveImages = async () => {
    setUploading(true); // Start uploading
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const fileInfo = await FileSystem.getInfoAsync(image);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }

        const imagePath = `images/${new Date().getTime()}/${Math.random().toString(36).substring(2)}`;
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, imagePath);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(`Upload is ${progress}% done`);

              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
                default:
                  break;
              }
            },
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            async () => {
              try {
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(downloadUrl);
              } catch (error) {
                console.error("Failed to get download URL:", error);
                reject(error);
              }
            }
          );
        });
      });

      await AsyncStorage.removeItem("selectedImages");
      const downloadUrls = await Promise.all(uploadPromises);
      await AsyncStorage.setItem("selectedImages", JSON.stringify(downloadUrls));
      setSelectedImages(downloadUrls);
      setNewSelectedImages(downloadUrls);

      setUploading(false); // Upload finished
      setUploadComplete(true); // Mark the upload as complete
      setUploadProgress("");
    } catch (error) {
      console.error("An error occurred:", error);
      setUploading(false); // In case of error, reset the uploading state
    }
  };

  return (
    <View style={styles.container}>
      {selectedImages.length > 0 && !uploadComplete && !uploading && (
        // Show the button only if there are selected images, upload is not complete, and it's not uploading
        <Button title="Save Images" onPress={saveImages} />
      )}

      {uploadProgress ? <Text>{uploadProgress}</Text> : null}

      {/* Show a message when the upload is complete */}
      {uploadComplete && <Text>Upload complete!</Text>}
    </View>
  );
};

export default SaveImageToFirebase;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
