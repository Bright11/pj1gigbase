import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Image, Alert, ScrollView, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/botton/Button';
import { router, useNavigation } from 'expo-router';



const ImagePickerComponent = (props) => {
    const { title = "Add",selectedImages, setSelectedImages, onSubmit, navigateTo }=props;
const MAX_IMAGES=3
  const navigation = useNavigation();
 
  const [imageDimensions, setImageDimensions] = useState({ width: 300, height: 400 });

  useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerTitleAlign: "center",
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft: () => (
        <Pressable onPress={() => router.replace("../(tabs)/Mypost")} style={{ marginLeft: 8 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission is required to take pictures.');
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      
      const images: string[] = [];
      let continueTakingPictures = true;

      while (continueTakingPictures) {
        const result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const { uri, width, height } = result.assets[0];
          images.push(uri);

          const screenWidth = Dimensions.get('window').width;
          const desiredWidth = Math.min(screenWidth - 40, 300);
          const aspectRatio = width / height;
          const calculatedHeight = desiredWidth / aspectRatio;

          setImageDimensions({ width: desiredWidth, height: calculatedHeight });

          continueTakingPictures = await new Promise((resolve) => {
            Alert.alert(
              "Take Another?",
              "Do you want to take another picture?",
              [
                { text: "No", onPress: () => resolve(false), style: "cancel" },
                { text: "Yes", onPress: () => resolve(true) },
              ]
            );
          });
        } else {
          continueTakingPictures = false;
        }
      }
    //  await AsyncStorage.setItem("selectedImages", JSON.stringify(images));
    //   setSelectedImages(images);
     
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const chooseFromGallery = async () => {
    try {
      if (selectedImages.length >= MAX_IMAGES) {
        Alert.alert("Limit Reached", `You can only upload up to ${MAX_IMAGES} images.`);
        return;
      }
      const images: string[] = [];
      let continueSelecting = true;

      while (continueSelecting) {
        const result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const { uri } = result.assets[0];
          images.push(uri);

          continueSelecting = await new Promise((resolve) => {
            Alert.alert(
              "Select More?",
              "Do you want to select another image?",
              [
                { text: "No", onPress: () => resolve(false), style: "cancel" },
                { text: "Yes", onPress: () => resolve(true) },
              ]
            );
          });
        } else {
          continueSelecting = false;
        }
      }

      setSelectedImages(images);
     // await AsyncStorage.setItem("selectedImages", JSON.stringify(images));
    } catch (error) {
      console.error("Error selecting images:", error);
    }
  };

  return (
    <View style={styles.container}>
    
       {selectedImages.length === 0 && (
                    <>
        <Button text="Take picture" onPress={takePicture} />
        <Button text="Choose from Gallery" onPress={chooseFromGallery} />
                  </>
        )}
      {selectedImages.length > 0 && (
        <>
          <ScrollView style={styles.galleryContainer} horizontal>
            {selectedImages.map((imageUri, index) => (
              <Image key={index} source={{ uri: imageUri }} style={styles.galleryImage} />
            ))}
          </ScrollView>
          {/* <Button text="Submit Save image" onPress={onSubmit} /> */}
        </>
      )}
    </View>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  galleryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  galleryImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
  },
});
