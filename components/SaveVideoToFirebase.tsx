import { StyleSheet, View, Alert, Button, Text } from 'react-native';
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { storage } from '@/components/firebase/Firebaseconfig';

const SaveVideoToFirebase = (props) => {
  const{selectedVideo, setSelectedVideo}=props;
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploading, setUploading] = useState(false); // Track uploading state
  const [doneuploading, setDoneuploading] = useState(false); // Track if upload is done

  const savevideo = async () => {
    if (!selectedVideo) {
      Alert.alert('Please select a video');
      return;
    }

    console.log("Start uploading video to Firebase");
    setUploading(true); // Set uploading state to true when upload starts

    try {
      const fileInfo = await FileSystem.getInfoAsync(selectedVideo);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const videoPath = `video/${new Date().getTime()}/${Math.random().toString(36).substring(2)}`;
      const response = await fetch(selectedVideo); // Fetch the video file
      const blob = await response.blob(); // Convert the file to a Blob

      const storageRef = ref(storage, videoPath); // Create a reference to Firebase storage
      const uploadTask = uploadBytesResumable(storageRef, blob); // Upload the Blob to Firebase

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(`Upload is ${Math.round(progress)}% done`);

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
          Alert.alert("Upload failed", "Unable to upload, please try again");
          setUploading(false); // Reset uploading state in case of an error
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref); // Get download URL
            console.log("Video uploaded successfully:", downloadUrl);
            setSelectedVideo(downloadUrl);
         

            // Save the video URL in AsyncStorage
            await AsyncStorage.setItem("video", downloadUrl);

            setDoneuploading(true); // Mark the upload as complete
            setUploading(false); // Reset uploading state
            setUploadProgress("");
            Alert.alert("Upload complete", "Video uploaded successfully");
          } catch (error) {
            console.error("Failed to get download URL:", error);
            Alert.alert("Error", "Failed to get download URL");
            setUploading(false); // Reset uploading state
          }
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Error, please try again");
      setUploading(false); // Reset uploading state in case of an error
    }
  };

  return (
    <>
      {selectedVideo && (
        <View style={styles.container}>
          {!uploading && !doneuploading && (
            // Show button only when not uploading and upload is not done
            <Button title="Save Video" onPress={savevideo} />
          )}

          {uploadProgress ? <Text>{uploadProgress}</Text> : null}

          {doneuploading && <Text>Upload complete!</Text>}
        </View>
      )}
    </>
  );
};

export default SaveVideoToFirebase;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
