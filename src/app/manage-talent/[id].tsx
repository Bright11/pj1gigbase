import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
import { useLocalSearchParams, router, useFocusEffect, useNavigation } from 'expo-router';

import { deleteTalent, getTalent, updateTalent, uploadGalleryImage, uploadTalentVideo } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Talent} from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import * as ImagePicker from 'expo-image-picker'
import TalentVideoSection from '@/utils/TalentVideoSection';
import TalentPhotoSection from '@/utils/TalentPhotoSource';
import Ionicons from '@expo/vector-icons/Ionicons';
import AvailabilityToggle from '@/utils/AvailabilityToggle';


export default function ManageTalentScreen() {
  const navigation=useNavigation()

  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:true,
      title:"",
      headerLeft:()=>(
        <Pressable onPress={()=> router.push('/dashboard')}>
           <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </Pressable>
      )
    })
  },[navigation])
  const { id } = useLocalSearchParams<{ id: string }>();

  const [talent, setTalent] = useState<Talent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] =
  useState(true);
const [isLoaded, setIsLoaded] = useState(false);
 


  const loadTalent = async () => {
    try {
      setIsLoading(true);

      const data = await getTalent(Number(id));

      setTalent(data);
       setIsAvailable(data.is_available);
    } catch (error) {
      Alert.alert('Error', getApiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

const handleDeleteTalent = (talentId: number) => {
  Alert.alert(
    'Delete Talent',
    'Are you sure you want to delete this talent profile? This action cannot be undone.',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTalent(talentId);

            Alert.alert(
              'Success',
              'Talent profile deleted successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    router.replace('/my-talents');
                  },
                },
              ]
            );
          } catch (error) {
            Alert.alert(
              'Delete Failed',
              getApiErrorMessage(error)
            );
          }
        },
      },
    ]
  );
};

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadTalent();
      }
    }, [id])
  );
  
  const handleAvailabilityChange = async (value: boolean) => {
  setIsAvailable(value);

  try {
    await updateTalent(Number(id), {
      is_available: value,
    });
  } catch (error) {
    setIsAvailable(!value);

    Alert.alert(
      "Error",
      getApiErrorMessage(error)
    );
  }
};
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
        
    <AvailabilityToggle
  value={isAvailable}
  onChange={handleAvailabilityChange}
/>

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
  router.push({
    pathname: '/edit-talent/[id]',
    params: { id: talent.id.toString() } 
  })
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

<Pressable style={{marginBottom:40,marginTop:15,backgroundColor:'red',alignContent:'center',padding:8, width:'auto', borderRadius:20} } onPress={()=>handleDeleteTalent(talent?.id)} >
  <Text style={{alignItems:"center",textAlign:'center', color:Mycolors.whitecolor,fontSize:18}}>Delet Talent </Text>
</Pressable>
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