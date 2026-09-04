import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';

import { getTalent, uploadGalleryImage, uploadTalentVideo } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Talent} from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import * as ImagePicker from 'expo-image-picker'
import TalentVideoSection from '@/utils/TalentVideoSection';
import TalentPhotoSection from '@/utils/TalentPhotoSource';


export default function ManageTalentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [talent, setTalent] = useState<Talent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // upload image or pictures
  const addPhotos = async ()=>{
  
    if (!talent)return
    const currentCount = talent.gallery_images.filter(
      (image)=>image.image_url
    ).length;

    const remainingSlots = 3 - currentCount;
    if(remainingSlots <=0){
      Alert.alert(
        "Maximum reached","You can only have 3 photos on one talent."
      )
      return
    }

    // const permission = await ImagePicker.requestCameraPermissionsAsync
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!permission.granted){
      Alert.alert(
        'Permission required','Please allow photo library access to select photos.'
      )
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsMultipleSelection:true,
      selectionLimit:remainingSlots,
      quality:0.8,
    });
    if(result.canceled || !result.assets.length){
      return
    }

    const selectedPhotos = result.assets.slice(
      0,
      remainingSlots
    );
    try{
      setIsLoading(true);
      for(const photo of selectedPhotos){
        await uploadGalleryImage(
          talent.id,
          photo.uri
        )
      }
      await loadTalent();
      Alert.alert(
        'Success',`${selectedPhotos.length > 1 ? 's':''} uploaded successfully`
      )
    }catch (error){
      Alert.alert('Uploaded failed', getApiErrorMessage(error))
      console.log("Error", getApiErrorMessage(error))
    }finally{
      setIsLoading(false)
    }
  }

  // video upload
//   const addVideo = async () => {
//   if (!talent) return;

//   const hasCloudinaryVideo = talent.videos.some(
//     (video) => video.source === 'cloudinary'
//   );

//   if (hasCloudinaryVideo) {
//     Alert.alert(
//       'Video limit reached',
//       'This talent already has a GIGBASE video.'
//     );
//     return;
//   }

//   const permission =
//     await ImagePicker.requestMediaLibraryPermissionsAsync();

//   if (!permission.granted) {
//     Alert.alert(
//       'Permission required',
//       'Please allow access to your media library to select a video.'
//     );
//     return;
//   }

//   const result =
//     await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ['videos'],
//       allowsMultipleSelection: false,
//       quality: 0.8,
//     });

//   if (result.canceled || !result.assets.length) {
//     return;
//   }

//   const video = result.assets[0];

//   try {
//     setIsLoading(true);

//     await uploadTalentVideo(
//       talent.id,
//       video.uri
//     );

//     await loadTalent();

//     Alert.alert(
//       'Success',
//       'Video uploaded successfully.'
//     );
//   } catch (error) {
//     Alert.alert(
//       'Upload failed',
//       getApiErrorMessage(error)
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };

  const loadTalent = async () => {
    try {
      setIsLoading(true);

      const data = await getTalent(Number(id));

      setTalent(data);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadTalent();
      }
    }, [id])
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading talent...
        </Text>
      </View>
    );
  }

  if (!talent) {
    return (
      <View style={styles.center}>
        <Text>Talent not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>‹ Back</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          Manage Talent
        </Text>

        <View style={{ width: 50 }} />
      </View>

      {/* Talent information */}
      <View style={styles.profileSection}>
        <Text style={styles.stageName}>
          {talent.stage_name || talent.title}
        </Text>

        <Text style={styles.title}>
          {talent.title}
        </Text>

        {talent.category_details && (
          <Text style={styles.category}>
            {talent.category_details.name}
          </Text>
        )}

        {talent.bio && (
          <Text style={styles.bio}>
            {talent.bio}
          </Text>
        )}

        <View style={styles.stats}>
          <View>
            <Text style={styles.statValue}>
              {talent.rating}
            </Text>

            <Text style={styles.statLabel}>
              Rating
            </Text>
          </View>

          <View>
            <Text style={styles.statValue}>
              {talent.total_bookings}
            </Text>

            <Text style={styles.statLabel}>
              Bookings
            </Text>
          </View>

          <View>
            <Text style={styles.statValue}>
              {talent.is_available ? 'Yes' : 'No'}
            </Text>

            <Text style={styles.statLabel}>
              Available
            </Text>
          </View>
        </View>
      </View>

      {/* Edit */}
      <Pressable
        style={styles.editButton}
        onPress={() =>
          Alert.alert(
            'Coming next',
            'Talent editing will be added next.'
          )
        }
      >
        <Text style={styles.editButtonText}>
          Edit Talent
        </Text>
      </Pressable>

      {/* Photos */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Photos 
          </Text>

          <Pressable
            onPress={
              addPhotos
            }
          >
            <Text style={styles.addText}>
              + Add Photo
            </Text>
          </Pressable> 
        </View>

        {talent.gallery_images.length === 0 ? (
          <View style={styles.emptyMedia}>
            <Text style={styles.emptyMediaText}>
              No photos added yet.
            </Text>
          </View>
        ) : (
          <View style={styles.imageGrid}>
            {talent.gallery_images.map((image) => (
              image.image_url ? (
                <Image
                  key={image.id}
                  source={{ uri: image.image_url }}
                  style={styles.galleryImage}
                />
              ) : null
            ))}
          </View>
        )}
      </View> */}

      <TalentPhotoSection talent={talent} onRefresh={loadTalent}/>
      <TalentVideoSection
  talent={talent}
  onRefresh={loadTalent}
/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Mycolors.whitecolor
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
    opacity: 0.6,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  backButton: {
    fontSize: 17,
    fontWeight: '600',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  profileSection: {
    marginBottom: 20,
  },

  stageName: {
    fontSize: 28,
    fontWeight: '700',
  },

  title: {
    marginTop: 5,
    fontSize: 16,
    opacity: 0.7,
  },

  category: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
  },

  bio: {
    marginTop: 15,
    fontSize: 15,
    lineHeight: 22,
  },

  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
  },

  editButton: {
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 28,
  },

  editButtonText: {
    fontWeight: '600',
  },

  section: {
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
  },

  addText: {
    fontSize: 15,
    fontWeight: '600',
  },

  emptyMedia: {
    paddingVertical: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 10,
  },

  emptyMediaText: {
    opacity: 0.5,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  galleryImage: {
    width: '31.8%',
    aspectRatio: 1,
    borderRadius: 8,
  },

  videoItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },

  videoSource: {
    fontWeight: '700',
    marginBottom: 5,
  },

  videoUrl: {
    opacity: 0.6,
  },
});