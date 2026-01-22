import { Pressable, StyleSheet, Text, View, Alert, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { router, useNavigation } from 'expo-router';
import { Colors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio, Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Button from '@/components/botton/Button';
import { Ionicons } from '@expo/vector-icons';


const Uploadvideo = () => {
  const navigation = useNavigation();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>({} as AVPlaybackStatus);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Video upload",
      headerTitleAlign:"center",
      headerTitleStyle: { fontWeight: 'bold' },
      headerLeft:()=>(
        <TouchableOpacity onPress={()=> router.back()} style={{marginLeft:8}}>
       <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  const choseVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
       
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedVideoUri = result.assets[0].uri;

        const { duration } = await VideoThumbnails.getThumbnailAsync(selectedVideoUri);

        const durationLimit = 30 * 1000;

        if (duration > durationLimit) {
          Alert.alert('Video too long', `The selected video exceeds the duration limit of ${durationLimit / 1000} seconds.`);
        } else {
          console.log('Video URI:', selectedVideoUri);
          setVideoUri(selectedVideoUri);
          await AsyncStorage.setItem("video", selectedVideoUri);
        }
      } else {
        console.log('User canceled video picking');
      }
    } catch (error) {

    }
  };
  const submitvideo=()=>{
    
    router.replace("/(tabs)/Sell");
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
   
 
      <Button onPress={choseVideo} style={styles.buttonupload}
      text={videoUri?
        <>Change Video</>
        :<>Upload Video</>}
      />
      {videoUri && (
        <Video
          ref={video}
          style={styles.video}
          source={{ uri: videoUri }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      )}
  
       {videoUri&&(
        
      
        <Button onPress={() =>
            status.isLoaded && status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()
          } style={styles.buttonupload}
        text={status.isLoaded && status.isPlaying ? 'Pause' : 'Play'}
        />
       )}
  
  {videoUri &&
 <Button text="Next" onPress={submitvideo}
 />  
}
    </KeyboardAvoidingView>
  );
};

export default Uploadvideo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    alignItems: 'center',
  },
 
  video: {
    width: 300, // Define explicit width
    height: 200, // Define explicit height
    backgroundColor: 'black', // Add background color
  },
 
  toptext: {
    width: "100%",
    textAlign: "center",
    color: Colors.appcolor.textblack,
    fontWeight: "600",
  },
  buttonupload: {
    margin: 10,
  },
 textarea:{
    height:100, 
    textAlignVertical: 'top',
    margin:10,
    borderWidth:1,
    borderColor:Colors.appcolor.textblack,
    borderRadius:8,
    padding:10,
    width:"80%"
 }
});
