
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';


import type { PublicTalent } from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import { router } from 'expo-router';

interface PublicTalentCardProps {
  talent: PublicTalent;
  onPress?: () => void;
  onChat?: (talentId: number) => void;
}

export default function PublicTalentCard({
  talent,
  onPress,
  onChat,
}: PublicTalentCardProps) {
  const image = talent.gallery_images.find(
    (item) => item.image_url,
  );

  const phoneNumber =
    talent.userprofile.phone_number?.trim();

  const profilePicture =
    talent.userprofile.profile_picture;

  const handleCall = () => {
    if (!phoneNumber) return;

    // Linking.openURL(`tel:${phoneNumber}`);
    if(Platform.OS === 'android') {
      Linking.openURL(`tel:${phoneNumber}`);
      return;
    }
    
    if(Platform.OS === 'ios') {
      Linking.openURL(`telprompt:${phoneNumber}`)
      return;
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
    onPress={()=> router.push({
        pathname: '/talentdetails/[slug]',
        params: {
          slug: talent.slug,
        },
      })}
      activeOpacity={0.85}
    >
      {/* IMAGE */}
      <View style={styles.imageSection}>
        {image?.image_url ? (
          <Image
            source={{ uri: image.image_url }}
            style={styles.image}
          />
        ) : profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>
              No Image
            </Text>
          </View>
        )}
      </View>

      {/* CONTENT */}
      <View style={styles.contentSection}>
        {/* TOP */}
        <View>
          <View style={styles.nameRow}>
            <Text
              style={styles.stageName}
              numberOfLines={1}
            >
              {talent.stage_name}
            </Text>

            <View
              style={[
                styles.statusDot,
                talent.is_available
                  ? styles.availableDot
                  : styles.unavailableDot,
              ]}
            />
          </View>
          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {talent.title}
          </Text>
        </View>

        {/* MIDDLE */}
        <View style={styles.detailsRow}>
          <Text style={styles.rating}>
            ★ {talent.rating}
          </Text>

          <Text style={styles.bookings}>
            {talent.total_bookings} bookings
          </Text>
        </View>

        {/* BOTTOM */}
        <View style={styles.bottomRow}>
          {/* <Text style={styles.rate}>
            {talent.currency} {talent.hourly_rate}
            <Text style={styles.rateSuffix}>
              {' '} /hr
            </Text>
          </Text> */}

          <View style={styles.actions}>
            {phoneNumber ? (
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCall}
              >
                <Text style={styles.callText}>
                   {phoneNumber}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => onChat?.(talent.id)}
            >
              <Text style={styles.chatText}>
              05867987598
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 145,
    marginBottom: 14,
    padding: 12,
    borderRadius: 16,
    backgroundColor: Mycolors.whitecolor,
  },

  /*
   * IMAGE
   */
  imageSection: {
    width: 115,
    height: 120,
    flexShrink: 0,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },

  imagePlaceholder: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 12,
  },

  /*
   * CONTENT
   */
  contentSection: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'space-between',
    minWidth: 0,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stageName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },

  availableDot: {
    backgroundColor: '#22C55E',
  },

  unavailableDot: {
    backgroundColor: '#9CA3AF',
  },

  title: {
    fontSize: 13,
    marginTop: 5,
  },

  /*
   * DETAILS
   */
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  rating: {
    fontSize: 12,
    fontWeight: '600',
  },

  bookings: {
    fontSize: 11,
  },

  /*
   * BOTTOM
   */
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  rate: {
    fontSize: 14,
    fontWeight: '700',
  },

  rateSuffix: {
    fontSize: 10,
    fontWeight: '400',
  },

  /*
   * ACTIONS
   */
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  callButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
   backgroundColor: Mycolors.primarycolor,
    borderWidth: 1,
    borderColor: Mycolors.primarycolor,
    width: '100%',
    alignItems: 'center',
  
  },

  callText: {
    fontSize: 11,
    fontWeight: '600',
      color: Mycolors.whitecolor,
  },

  chatButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: Mycolors.primarycolor,
    borderWidth: 1,
    borderColor: Mycolors.primarycolor,
    width: '100%',
    alignItems: 'center',
    
  },

  chatText: {
    fontSize: 11,
    fontWeight: '600',
    color: Mycolors.whitecolor,
  },
});

