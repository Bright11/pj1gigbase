import { StyleSheet, View, Text, Alert } from 'react-native';
import React, { useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av'; // Import Video for playback
import Button from './botton/Button';

const ChoseVideoFromDevice = (props) => {
  const {setOpenvideo, selectedVideo,setSelectedVideo }=props;
  // Request permission for media library access
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
    }
  };

  useEffect(() => {
    requestPermissions(); // Request permissions when the component mounts
    //loadSavedVideoUri();   // Load the saved video URI when component mounts
  }, []);

  // Function to handle selecting a video
  const chooseVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const videoUri = result.assets[0].uri; // Get the video URI
      setSelectedVideo(videoUri);            // Set the selected video URI
    //   setVideoUri(videoUri);                 // Optionally store or save URI elsewhere
    //  console.log("Selected video URI:", videoUri); 
     // await saveVideoUri(videoUri);          // Save video URI to local storage
    }
  };

  

 
const loadSavedVideoUri=async()=>{
    setOpenvideo(false)
}
  return (
    <View style={styles.container}>
      {!selectedVideo && (
       <>
       <Text style={{textAlign:"center"}}>Optional</Text>
       <Button text="Choose Video" onPress={chooseVideo} />
       </>
      )}
   
      {selectedVideo && (
        <>
          <Text style={{textAlign:"center"}}>Video selected:</Text>
          {/*  <Text>Video selected: {selectedVideo}</Text> */}
          <Video
            source={{ uri: selectedVideo }}   // Display the video
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </>
      )}
      {/* <Button title="Load Saved Video URI" onPress={loadSavedVideoUri} /> */}
    </View>
  );
};

export default ChoseVideoFromDevice;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  video: {
    width: '100%',
    height: 150,
    backgroundColor: 'black',
  },
});
