import { StyleSheet, View, Button, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { storage } from '@/components/firebase/Firebaseconfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Updatepicinfirebase = (props) => {
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploading, setUploading] = useState(false); // Track uploading state
  const [uploadComplete, setUploadComplete] = useState(false); // Track if upload is done
  const {uploadedimage ,setUploadedimage,setImagereadyupload } = props;

 // console.log(uploadedimage)
  const saveImage = async () => {
    if (!uploadedimage) {
      Alert.alert("Error",'Please select an image');
      return;
    }

    setUploading(true); // Start uploading
    try {
      const fileInfo = await FileSystem.getInfoAsync(uploadedimage);
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const imagePath = `profile/${new Date().getTime()}/${Math.random().toString(36).substring(2)}`;
      const response = await fetch(uploadedimage);
      const blob = await response.blob();
      const storageRef = ref(storage, imagePath);
      const uploadTask = uploadBytesResumable(storageRef, blob);

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
        },
        async () => {
          try {
           
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            
            setUploadedimage("");
            setImagereadyupload(downloadUrl)
            setUploading(false); // Upload finished
            setUploadComplete(true); // Mark the upload as complete
            setUploadProgress(""); // Reset progress
            console.log('Image uploaded successfully:', downloadUrl);
          } catch (error) {
           // console.error("Failed to get download URL:", error);
            setUploading(false); // Reset the uploading state in case of error
          }
        }
      );
    } catch (error) {
      console.error("An error occurred:", error);
      setUploading(false); // Reset the uploading state in case of error
    }
  };

  console.log(uploadedimage)
  return (
    <View style={styles.container}>
      {uploadedimage && !uploadComplete && !uploading && (
        // Show the button only if an image is selected, upload is not complete, and it's not uploading
        <Button title="Save Image" onPress={saveImage} />
      )}

      {uploadProgress ? <Text>{uploadProgress}</Text> : null}

      {/* Show a message when the upload is complete */}
      {uploadComplete && <Text>Upload complete!</Text>}
    </View>
  );
};

export default Updatepicinfirebase;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
