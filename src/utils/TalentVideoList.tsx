import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

import type { TalentVideo } from '@/types/Talent';
import { deleteTalentVideo } from '@/services/talent.service';
import { Mycolors } from '@/constants/mycolors';

interface TalentVideoListProps {
  videos: TalentVideo[];
  onRefresh: () => Promise<void>;
}

interface TalentVideoCardProps {
  video: TalentVideo;
  onRefresh: () => Promise<void>;
}

function TalentVideoCard({
  video,
  onRefresh,
}: TalentVideoCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const player = useVideoPlayer(
    video.video_url ?? '',
    (player) => {
      player.loop = false;
    },
  );

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

  return (
    <View style={styles.card}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls
      />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.deleteButtonText}>
            Delete
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function TalentVideoList({
  videos,
  onRefresh,
}: TalentVideoListProps) {
  const gigbaseVideos = videos.filter(
    (video) =>
      video.source === 'cloudinary' &&
      !!video.video_url,
  );

  if (!gigbaseVideos.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No GIGBASE video added yet.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Your GIGBASE Video
      </Text>

      {gigbaseVideos.map((video) => (
        <TalentVideoCard
          key={video.id}
          video={video}
          onRefresh={onRefresh}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },

  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },

  deleteButton: {
    marginTop: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor:Mycolors.redcolor
  },

  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color:Mycolors.whitecolor
  },

  emptyContainer: {
    marginTop: 16,
  },

  emptyText: {
    fontSize: 14,
  },
});