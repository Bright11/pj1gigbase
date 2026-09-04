
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


import { uploadGalleryImage } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Talent } from '@/types/Talent';

interface TalentPhotoSectionProps {
  talent: Talent;
  onRefresh: () => Promise<void>;
}

export default function TalentPhotoSection({
  talent,
  onRefresh,
}: TalentPhotoSectionProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Ignore gallery items that don't have an actual image URL
  const images = talent.gallery_images?.filter(
    (image) => image.image_url
  ) ?? [];

  const remainingSlots = 3 - images.length;

  const addPhotos = async () => {
    if (remainingSlots <= 0) {
      Alert.alert(
        'Photo Limit',
        'You can only have a maximum of 3 photos.'
      );
      return;
    }

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsMultipleSelection: true,
          selectionLimit: remainingSlots,
          quality: 0.8,
        });

      if (
        result.canceled ||
        !result.assets.length
      ) {
        return;
      }

      setIsUploading(true);

      for (const image of result.assets) {
        await uploadGalleryImage(
          talent.id,
          image.uri
        );
      }

      await onRefresh();

      Alert.alert(
        'Success',
        `${result.assets.length} photo${
          result.assets.length > 1 ? 's' : ''
        } uploaded successfully.`
      );
    } catch (error) {
      Alert.alert(
        'Upload Failed',
        getApiErrorMessage(error)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Photos
      </Text>

      <Text style={styles.description}>
        Add up to 3 photos to showcase your talent.
      </Text>

      <View style={styles.imageGrid}>
        {images.map((image) => (
          <View
            key={image.id}
            style={styles.imageWrapper}
          >
            <Image
              source={{
                uri: image.image_url!,
              }}
              style={styles.image}
            />
          </View>
        ))}

        {remainingSlots > 0 && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={addPhotos}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Text style={styles.plus}>
                  +
                </Text>

                <Text style={styles.addText}>
                  Add Photos
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      {remainingSlots === 0 && (
        <Text style={styles.limitText}>
          You have reached the maximum of 3 photos.
        </Text>
      )}

      {isUploading && (
        <Text style={styles.uploadingText}>
          Uploading photos...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  plus: {
    fontSize: 28,
    fontWeight: '300',
  },

  addText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  limitText: {
    marginTop: 12,
    fontSize: 13,
    color: '#666',
  },

  uploadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
});

