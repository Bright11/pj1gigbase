import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';

import type { PublicTalent } from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { optimizeCloudinaryImage } from './cloudinaryImage';

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
    (item) => !!item.image_url,
  );

  const phoneNumber =
    talent.userprofile.phone_number?.trim();

  const profilePicture =
    talent.userprofile.profile_picture;

  const location = [
    talent.userprofile.city,
    talent.userprofile.country,
  ]
    .filter(Boolean)
    .join(', ');

  const reviewCount =
    talent.review_count ??
    talent.reviews?.length ??
    0;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push({
      pathname: '/talentdetails/[slug]',
      params: {
        slug: talent.slug,
      },
    });
  };

  const handleCall = async () => {
    if (!phoneNumber) return;

    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL(
          `telprompt:${phoneNumber}`,
        );
      } else {
        await Linking.openURL(
          `tel:${phoneNumber}`,
        );
      }
    } catch (error) {
      console.log('Unable to call talent:', error);
    }
  };

  const handleViewProfile = () => {
    router.push({
      pathname: '/talentdetails/[slug]',
      params: {
        slug: talent.slug,
      },
    });
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
    >
      {/* ---------------------------------------------------------------- */}
      {/* IMAGE                                                            */}
      {/* ---------------------------------------------------------------- */}

      <View style={styles.imageWrapper}>
        {image?.image_url ? (
          // <Image
          //   source={{ uri: image.image_url }}
          //   style={styles.image}
          // />
          <Image
  source={{
    uri: optimizeCloudinaryImage(image.image_url, {
      width: 400,
    }),
  }}
  style={styles.image}
/>
        ) : profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons
              name="person-outline"
              size={32}
              color={Mycolors.graycolor}
            />
          </View>
        )}

        {/* Availability */}
        <View
          style={[
            styles.availabilityBadge,
            talent.is_available
              ? styles.availableBadge
              : styles.unavailableBadge,
          ]}
        >
          <View
            style={[
              styles.availabilityDot,
              talent.is_available
                ? styles.availableDot
                : styles.unavailableDot,
            ]}
          />

          <Text
            style={[
              styles.availabilityText,
              talent.is_available
                ? styles.availableText
                : styles.unavailableText,
            ]}
          >
            {talent.is_available
              ? 'Available'
              : 'Unavailable'}
          </Text>
        </View>
      </View>

      {/* ---------------------------------------------------------------- */}
      {/* CONTENT                                                          */}
      {/* ---------------------------------------------------------------- */}

      <View style={styles.content}>
        {/* Name + arrow */}
        <View style={styles.headerRow}>
          <View style={styles.nameContainer}>
            <Text
              style={styles.stageName}
              numberOfLines={1}
            >
              {talent.stage_name}
            </Text>

            <Text
              style={styles.username}
              numberOfLines={1}
            >
              @{talent.user_details.username}
            </Text>
          </View>

          <View style={styles.arrowButton}>
            <Ionicons
              name="chevron-forward"
              size={17}
              color={Mycolors.primarycolor}
            />
          </View>
        </View>

        {/* Profession */}
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {talent.title}
        </Text>

        {/* Location */}
        {location ? (
          <View style={styles.locationRow}>
            <Ionicons
              name="location-outline"
              size={13}
              color="#8A8F9C"
            />

            <Text
              style={styles.locationText}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>
        ) : null}

        {/* ---------------------------------------------------------------- */}
        {/* STATS                                                           */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons
              name="star"
              size={14}
              color={Mycolors.secondarycolor}
            />

            <Text style={styles.statValue}>
              {talent.rating ?? 0}
            </Text>

            <Text style={styles.statLabel}>
              ({reviewCount})
            </Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.stat}>
            <Ionicons
              name="briefcase-outline"
              size={14}
              color={Mycolors.primarycolor}
            />

            <Text style={styles.statValue}>
              {talent.total_bookings ?? 0}
            </Text>

            <Text style={styles.statLabel}>
              bookings
            </Text>
          </View>
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* BOTTOM                                                           */}
        {/* ---------------------------------------------------------------- */}

        <View style={styles.bottomRow}>
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>
              FROM
            </Text>

            <Text
              style={styles.price}
              numberOfLines={1}
            >
              {talent.currency}{' '}
              {talent.hourly_rate}
            </Text>

            <Text style={styles.priceSuffix}>
              /hr
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {phoneNumber ? (
              <Pressable
                style={({ pressed }) => [
                  styles.callButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleCall}
                hitSlop={6}
              >
                <Ionicons
                  name="call-outline"
                  size={17}
                  color={Mycolors.primarycolor}
                />
              </Pressable>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                styles.viewButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleViewProfile}
            >
              <Text style={styles.viewButtonText}>
                View Profile
              </Text>

              <Ionicons
                name="arrow-forward"
                size={15}
                color={Mycolors.primarycolor}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 166,

    flexDirection: 'row',

    marginBottom: 14,

    padding: 10,

    borderRadius: 18,

    backgroundColor: Mycolors.whitecolor,

    borderWidth: 1,
    borderColor: '#ECEEF2',

    shadowColor: Mycolors.blackcolor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,

    elevation: 3,
  },

  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },

  /* ---------------------------------------------------------------------- */
  /* IMAGE                                                                  */
  /* ---------------------------------------------------------------------- */

  imageWrapper: {
    width: 122,
    height: 146,

    borderRadius: 14,

    overflow: 'hidden',

    backgroundColor: '#F1F2F5',

    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  /* ---------------------------------------------------------------------- */
  /* AVAILABILITY                                                           */
  /* ---------------------------------------------------------------------- */

  availabilityBadge: {
    position: 'absolute',

    left: 7,
    bottom: 7,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 20,

    backgroundColor: 'rgba(255,255,255,0.94)',

    gap: 5,
  },

  availableBadge: {
    borderColor: '#D8F0DF',
  },

  unavailableBadge: {
    borderColor: '#E5E7EB',
  },

  availabilityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  availableDot: {
    backgroundColor: Mycolors.greencolor,
  },

  unavailableDot: {
    backgroundColor: Mycolors.graycolor,
  },

  availabilityText: {
    fontSize: 9,
    fontWeight: '800',
  },

  availableText: {
    color: Mycolors.greencolor,
  },

  unavailableText: {
    color: '#777C87',
  },

  /* ---------------------------------------------------------------------- */
  /* CONTENT                                                                */
  /* ---------------------------------------------------------------------- */

  content: {
    flex: 1,

    minWidth: 0,

    marginLeft: 13,

    paddingVertical: 2,

    justifyContent: 'space-between',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  nameContainer: {
    flex: 1,
    minWidth: 0,
  },

  stageName: {
    color: Mycolors.primarycolor,

    fontSize: 17,

    fontWeight: '900',

    letterSpacing: -0.2,
  },

  username: {
    color: '#9CA3AF',

    fontSize: 10,

    fontWeight: '600',

    marginTop: 2,
  },

  arrowButton: {
    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: '#F2F4F8',

    alignItems: 'center',
    justifyContent: 'center',

    marginLeft: 6,
  },

  title: {
    color: '#4B5563',

    fontSize: 12.5,

    lineHeight: 17,

    fontWeight: '600',

    marginTop: 7,
  },

  /* ---------------------------------------------------------------------- */
  /* LOCATION                                                               */
  /* ---------------------------------------------------------------------- */

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 6,

    gap: 4,
  },

  locationText: {
    flex: 1,

    color: '#8A8F9C',

    fontSize: 10.5,

    fontWeight: '500',
  },

  /* ---------------------------------------------------------------------- */
  /* STATS                                                                  */
  /* ---------------------------------------------------------------------- */

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 9,

    paddingTop: 8,

    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ECEEF2',
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 4,
  },

  statValue: {
    color: Mycolors.primarycolor,

    fontSize: 11,

    fontWeight: '800',
  },

  statLabel: {
    color: '#9CA3AF',

    fontSize: 10,

    fontWeight: '500',
  },

  statDivider: {
    width: 1,
    height: 13,

    backgroundColor: '#E5E7EB',

    marginHorizontal: 9,
  },

  /* ---------------------------------------------------------------------- */
  /* BOTTOM                                                                 */
  /* ---------------------------------------------------------------------- */

  bottomRow: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 9,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',

    minWidth: 0,
  },

  priceLabel: {
    color: '#9CA3AF',

    fontSize: 8,

    fontWeight: '800',

    marginRight: 4,
  },

  price: {
    color: Mycolors.primarycolor,

    fontSize: 14,

    fontWeight: '900',

    maxWidth: 75,
  },

  priceSuffix: {
    color: '#8A8F9C',

    fontSize: 9,

    marginLeft: 2,
  },

  /* ---------------------------------------------------------------------- */
  /* ACTIONS                                                                */
  /* ---------------------------------------------------------------------- */

  actions: {
    flexDirection: 'row',
    alignItems: 'center',

    gap: 6,

    marginLeft: 6,
  },

  callButton: {
    width: 36,
    height: 36,

    borderRadius: 11,

    backgroundColor: '#F1F3F8',

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
    borderColor: '#E2E5EC',
  },

  viewButton: {
    height: 36,

    paddingHorizontal: 11,

    borderRadius: 11,

    backgroundColor: Mycolors.secondarycolor,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  viewButtonText: {
    color: Mycolors.primarycolor,

    fontSize: 10.5,

    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
