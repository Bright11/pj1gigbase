import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  VideoView,
  useVideoPlayer,
} from 'expo-video';

import type {
  TalentVideo,
} from '@/types/Talent';
import { deleteTalentVideo } from '@/services/talent.service';
import { Mycolors } from '@/constants/mycolors';

interface TalentVideoListProps {
  videos: TalentVideo[];
  onRefresh: ()=>Promise<void>
}

interface TalentVideoCardProps {
  video: TalentVideo;
  onRefresh:()=> Promise<void>;
}

function TalentVideoCard({
  video,onRefresh
}: TalentVideoCardProps) {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video?',
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
              setIsDeleting(true);

              await deleteTalentVideo(video.id);
              await onRefresh();

              Alert.alert(
                'Deleted',
                'Video deleted successfully.',
              );
            } catch (error) {
              Alert.alert(
                'Delete Failed',
                'Unable to delete this video. Please try again.',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  const player = useVideoPlayer(
    video.source === 'cloudinary'
      ? video.video_url ?? ''
      : null,
    (player) => {
      player.loop = false;
    }
  );

  const openExternalVideo = async () => {
    if (!video.url) {
      return;
    }

    try {
      setLoading(true);
      await Linking.openURL(video.url);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // GIGBASE / CLOUDINARY
  // ==============================

  if (video.source === 'cloudinary') {
    if (!video.video_url) {
      return null;
    }

    return (
      <View style={styles.card}>
        <View style={styles.videoContainer}>
          <VideoView
            player={player}
            style={styles.video}
            contentFit="cover"
            nativeControls
          />
        </View>

        <Text style={styles.sourceText}>
          GIGBASE Video
        </Text>
        <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}>
          {isDeleting?(
            <ActivityIndicator/>
          ):(
            <Text style={styles.deleteButtonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // ==============================
  // YOUTUBE
  // ==============================

  if (video.source === 'youtube') {
    const youtubeId =
      getYouTubeVideoId(video.url);

    return (
      <View style={styles.card}>
        <Pressable
          style={styles.thumbnailContainer}
          onPress={openExternalVideo}
          disabled={loading}
        >
          {youtubeId ? (
            <Image
              source={{
                uri: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
              }}
              style={styles.thumbnail}
            />
          ) : (
            <View style={styles.fallbackThumbnail}>
              <Text style={styles.fallbackText}>
                YouTube 
              </Text>
              
            </View>
          )}

          <View style={styles.playButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.playIcon}>
                ▶
              </Text>
            )}
          </View>
        </Pressable>

        <Text style={styles.sourceText}>
          YouTube
        </Text>
        <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}>
          {isDeleting?(
            <ActivityIndicator/>
          ):(
            <Text style={styles.deleteButtonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // ==============================
  // TIKTOK
  // ==============================

  if (video.source === 'tiktok') {
    return (
      <View style={styles.card}>
        <Pressable
          style={styles.tiktokContainer}
          onPress={openExternalVideo}
          disabled={loading}
        >
          <Text style={styles.tiktokLogo}>
            ♪
          </Text>

          <Text style={styles.tiktokText}>
            TikTok
          </Text>

          <View style={styles.playButton}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.playIcon}>
                ▶
              </Text>
            )}
          </View>
        </Pressable>

        <Text style={styles.sourceText}>
          TikTok
        </Text>
        <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}>
          {isDeleting?(
            <ActivityIndicator/>
          ):(
            <Text style={styles.deleteButtonText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

function getYouTubeVideoId(
  url: string | null
): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsedUrl = new URL(url);

    // https://www.youtube.com/watch?v=xxxxx
    if (
      parsedUrl.hostname.includes(
        'youtube.com'
      )
    ) {
      return parsedUrl.searchParams.get('v');
    }

    // https://youtu.be/xxxxx
    if (
      parsedUrl.hostname === 'youtu.be'
    ) {
      return parsedUrl.pathname.replace(
        '/',
        ''
      );
    }

    return null;
  } catch {
    return null;
  }
}

export default function TalentVideoList({
  videos,onRefresh,
}: TalentVideoListProps) {
  // delete videos


// the end of delete video
  if (!videos.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No videos added yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.existingTitle}>
        Added Videos
      </Text>

      <View style={styles.grid}>
        {videos.map((video) => (
          <TalentVideoCard
            key={video.id}
            video={video}
            onRefresh={onRefresh}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  existingTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  card: {
    width: '48%',
  },

  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
  },

  video: {
    width: '100%',
    height: '100%',
  },

  thumbnailContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
    position: 'relative',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  fallbackThumbnail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#222',
  },

  fallbackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  tiktokContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tiktokLogo: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '700',
  },

  tiktokText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },

  playButton: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    borderRadius: 24,
    backgroundColor:
      'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  playIcon: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 3,
  },

  sourceText: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: '600',
  },

  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
  },
  deleteButton: {
  marginTop: 8,
  paddingVertical: 8,
  alignItems: 'center',
  borderRadius: 8,
  backgroundColor:Mycolors.redcolor
},

deleteButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color:Mycolors.whitecolor
},
});