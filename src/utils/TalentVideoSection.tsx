
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import {
  uploadTalentVideo,
} from '@/services/talent.service';

import {
  getApiErrorMessage,
} from '@/services/api.error';
import { Talent, TalentVideoSource } from '@/types/Talent';
import TalentVideoList from './TalentVideoList';

interface TalentVideoSectionProps {
  talent: Talent;
  onRefresh: () => Promise<void>;
}

export default function TalentVideoSection({
  talent,
  onRefresh,
}: TalentVideoSectionProps) {
  const [videoSource, setVideoSource] =
    useState<TalentVideoSource>('cloudinary');

  const [videoUrl, setVideoUrl] =
    useState('');

  const [isUploading, setIsUploading] =
    useState(false);

  const hasCloudinaryVideo =
    talent.videos?.some(
      (video) =>
        video.source === 'cloudinary'
    );

  const addVideo = async () => {
    try {
      // ==========================================
      // GIGBASE VIDEO
      // ==========================================

      if (videoSource === 'cloudinary') {
        if (hasCloudinaryVideo) {
          Alert.alert(
            'Video Limit',
            'You can only upload one video to GIGBASE.'
          );
          return;
        }

        const permission =
          await ImagePicker
            .requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Permission Required',
            'Please allow access to your media library.'
          );
          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsMultipleSelection: false,
            quality: 0.8,
          });

        if (
          result.canceled ||
          !result.assets.length
        ) {
          return;
        }

        const video =
          result.assets[0];

        setIsUploading(true);

        await uploadTalentVideo(
          talent.id,
          'cloudinary',
          video.uri
        );

        await onRefresh();

        Alert.alert(
          'Success',
          'Your video has been uploaded successfully.'
        );

        return;
      }

      // ==========================================
      // YOUTUBE / TIKTOK
      // ==========================================

      const trimmedUrl =
        videoUrl.trim();

      if (!trimmedUrl) {
        Alert.alert(
          'Video URL Required',
          `Please enter your ${videoSource} video URL.`
        );
        return;
      }

      setIsUploading(true);

      await uploadTalentVideo(
        talent.id,
        videoSource,
        undefined,
        trimmedUrl
      );

      setVideoUrl('');

      await onRefresh();

      Alert.alert(
        'Success',
        'Your video has been added successfully.'
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
        Videos
      </Text>

      <Text style={styles.description}>
        Add one GIGBASE video or link videos
        from YouTube and TikTok.
      </Text>

      {/* SOURCE SELECTOR */}

      <View style={styles.sourceContainer}>

        <TouchableOpacity
          style={[
            styles.sourceButton,
            videoSource === 'cloudinary' &&
              styles.sourceButtonActive,
          ]}
          onPress={() => {
            setVideoSource('cloudinary');
            setVideoUrl('');
          }}
          disabled={isUploading}
        >
          <Text
            style={[
              styles.sourceText,
              videoSource === 'cloudinary' &&
                styles.sourceTextActive,
            ]}
          >
            GIGBASE
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sourceButton,
            videoSource === 'youtube' &&
              styles.sourceButtonActive,
          ]}
          onPress={() => {
            setVideoSource('youtube');
          }}
          disabled={isUploading}
        >
          <Text
            style={[
              styles.sourceText,
              videoSource === 'youtube' &&
                styles.sourceTextActive,
            ]}
          >
            YouTube
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sourceButton,
            videoSource === 'tiktok' &&
              styles.sourceButtonActive,
          ]}
          onPress={() => {
            setVideoSource('tiktok');
          }}
          disabled={isUploading}
        >
          <Text
            style={[
              styles.sourceText,
              videoSource === 'tiktok' &&
                styles.sourceTextActive,
            ]}
          >
            TikTok
          </Text>
        </TouchableOpacity>

      </View>

      {/* GIGBASE */}

      {videoSource === 'cloudinary' && (
        <>
          {hasCloudinaryVideo ? (
            <Text style={styles.limitText}>
              You already have a GIGBASE video uploaded.
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={addVideo}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.addButtonText}>
                  + Select Video
                </Text>
              )}
            </TouchableOpacity>
          )}
        </>
      )}

      {/* YOUTUBE / TIKTOK */}

      {(videoSource === 'youtube' ||
        videoSource === 'tiktok') && (
        <>
          <TextInput
            style={styles.input}
            placeholder={`Paste ${videoSource} video URL`}
            value={videoUrl}
            onChangeText={setVideoUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            editable={!isUploading}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={addVideo}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.addButtonText}>
                + Add Video
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {/* EXISTING VIDEOS */}

      {talent.videos?.length > 0 && (
        <View style={styles.videoList}>

          {/* <Text style={styles.existingTitle}>
            Added Videos
          </Text>

          {talent.videos.map((video) => (
            <View
              key={video.id}
              style={styles.videoItem}
            >
              <Text style={styles.videoSource}>
                {video.source === 'cloudinary'
                  ? 'GIGBASE'
                  : video.source === 'youtube'
                  ? 'YouTube'
                  : 'TikTok'}
              </Text>

              {video.video_url && (
                <Text
                  style={styles.videoUrl}
                  numberOfLines={2}
                >
                  {video.video_url}
                </Text>
              )}
            </View>
          ))} */}
        <TalentVideoList videos={talent.videos?? []}
        onRefresh={onRefresh}
        />
        </View>
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

  sourceContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  sourceButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },

  sourceButtonActive: {
    borderWidth: 2,
  },

  sourceText: {
    fontSize: 14,
    fontWeight: '600',
  },

  sourceTextActive: {
    fontWeight: '700',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 12,
  },

  addButton: {
    paddingVertical: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    borderRadius: 10,
    alignItems: 'center',
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },

  limitText: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 12,
  },

  videoList: {
    marginTop: 24,
  },

  existingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  videoItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },

  videoSource: {
    fontSize: 15,
    fontWeight: '700',
  },

  videoUrl: {
    marginTop: 6,
    fontSize: 13,
    color: '#666',
  },
});
