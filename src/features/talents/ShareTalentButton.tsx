
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Mycolors } from '@/constants/mycolors';

interface ShareTalentButtonProps {
  slug: string;
  talentName: string;
  iconOnly?: boolean;
}

export default function ShareTalentButton({
  slug,
  talentName,
  iconOnly = false,
}: ShareTalentButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!slug || sharing) return;

    const talentUrl =
      `https://www.pj1gigbase.com/details/${encodeURIComponent(slug)}`;

    const message =
      `Discover ${talentName} on PJ1 GIGBASE!\n\n` +
      `View this talent's profile here:\n${talentUrl}`;

    try {
      setSharing(true);

      await Share.share(
        {
          title: `Discover ${talentName} on PJ1 GIGBASE`,
          message,
          url: talentUrl,
        },
        {
          dialogTitle: 'Share Talent',
        },
      );
    } catch (error) {
      console.error('Unable to share talent:', error);

      Alert.alert(
        'Unable to Share',
        'We could not open the sharing menu. Please try again.',
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <TouchableOpacity
      style={iconOnly ? styles.iconButton : styles.button}
      onPress={handleShare}
      disabled={sharing}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`Share ${talentName}`}
    >
      {sharing ? (
        <ActivityIndicator
          size="small"
          color={
            iconOnly
              ? Mycolors.whitecolor
              : Mycolors.primarycolor
          }
        />
      ) : (
        <View style={styles.content}>
          <Ionicons
            name="share-social-outline"
            size={21}
            color={
              iconOnly
                ? Mycolors.whitecolor
                : Mycolors.primarycolor
            }
          />

          {!iconOnly && (
            <Text style={styles.buttonText}>
              Share Talent
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(1,4,37,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },

  button: {
    minHeight: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D9DDE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  buttonText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '700',
  },
});

