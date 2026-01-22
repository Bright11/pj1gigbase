import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/components/firebase/Firebaseconfig';
import * as FileSystem from 'expo-file-system';
import Octicons from '@expo/vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

const ImageUploader = (props) => {
  const { setIsediting,isediting,selectedImages, setSelectedImages, setNewSelectedImages, setSendImage, setMainImage, setMyProgress } = props;

  useEffect(() => {
    const fetchStoredImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem('selectedImages');
        if (storedImages !== null) {
          setSelectedImages(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error('Error retrieving images:', error);
      }
    };

    fetchStoredImages();
   // console.log('Selected Images:', selectedImages); // Log selected images for debugging
  }, [selectedImages]);

  const saveImages = async () => {
    if (!selectedImages || selectedImages.length === 0) {
      Alert.alert('Please select images');
      return;
    }

    setMyProgress('Starting');
    try {
      const uploadPromises = selectedImages.map(async (fileUri) => {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }

        const imagePath = `images/${new Date().getTime()}/${Math.random().toString(36).substring(2)}`;
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const storageRef = ref(storage, imagePath);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setMyProgress(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error('Upload failed:', error);
              reject(error);
            },
            async () => {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            }
          );
        });
      });

      const downloadUrls = await Promise.all(uploadPromises);
      setMainImage((prevMainImage) => prevMainImage || downloadUrls[0]);
      setNewSelectedImages(downloadUrls);
      setSendImage(true);
      setMyProgress('');
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <View>
      <Pressable style={styles.addImageView} onPress={() => router.replace('/(tabs)/Takephoto')}>
        <Octicons name="diff-added" size={34} color="white" />
        <Text style={styles.addPicText}>Add Picture</Text>
      </Pressable>
      
      <View style={styles.addvertImageContainer}>
        {selectedImages && selectedImages.length > 0 ? (
          <ScrollView horizontal={true} style={styles.addedImageScrollView}>
            {selectedImages.map((imageUri, index) => {
              //console.log('Image URI:', imageUri); // Log each image URI
              return (
                <Image style={styles.imageSelected} key={index} source={{ uri: imageUri }} />
              );
            })}
          </ScrollView>
        ) : (
          <Text>No Images Selected</Text>
        )}
      </View>

      {/* Test with a static image */}
     

      <Pressable onPress={saveImages} style={styles.saveButton}>
        {isediting?
        <Text style={styles.saveButtonText}>Next 1 (Upload Images edited)</Text>
        :
        <Text style={styles.saveButtonText}>Next 1 (Upload Images)</Text>
        }
        
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  addImageView: {
    backgroundColor: Colors.appcolor.begreen,
    borderRadius: 5,
    padding: 10,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: "center"
  },
  addPicText: { 
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  addedImageScrollView: { 
    display: "flex", 
    flexDirection: "row", 
    margin: 6, 
    gap: 8 
  },
  imageSelected: { 
    width: 80,
    height: 80,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: Colors.appcolor.promarycolor,
  },
  saveButton: { 
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: { 
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,  
  }
});

export default ImageUploader;
