import { StyleSheet, View, Text, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Button from '@/components/botton/Button';

const Changprofilpic = (props) => {
  const{uploadedimage, setUploadedimage }=props;
  // Request permission for media library access
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
    }
  };

  useEffect(() => {
    requestPermissions(); // Request permissions when the component mounts
  }, []);
 // console.log(uploadedimage)
  // Function to handle selecting an image
  const chooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Set to Images
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri; // Safely access the first asset's URI
      setUploadedimage(imageUri);            // Set the selected image URI
    } else {
      Alert.alert('No image selected');
    }
  };

  return (
    <View style={styles.container}>
      <Button text="Choose Image" onPress={chooseImage} />
   
      {uploadedimage && (
        <>
          <Text>Image selected:</Text>
        </>
      )}
    </View>
  );
};

export default Changprofilpic;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: 'black',
  },
});
