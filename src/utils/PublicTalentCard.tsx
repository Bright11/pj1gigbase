
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import type { PublicTalent } from '@/types/Talent';
import { Mycolors } from '@/constants/mycolors';
import { optimizeCloudinaryImage } from './cloudinaryImage';

interface PublicTalentCardProps {
  talent: PublicTalent;
  onPress?: () => void;
  onChat?: (talentId: number) => void;
}

export default function PublicTalentCard({
  talent,
  onPress,
}: PublicTalentCardProps) {
  const image = talent.gallery_images?.find(
    (item) => !!item.image_url,
  );

  const phoneNumber = talent.userprofile.phone_number?.trim();
  const profilePicture = talent.userprofile.profile_picture;

  const location = [
    talent.userprofile.city,
    talent.userprofile.country,
  ]
    .filter(Boolean)
    .join(', ');

  const reviewCount =
    talent.review_count ?? talent.reviews?.length ?? 0;

  const rating = Number(talent.rating ?? 0);

  const price = talent.hourly_rate || talent.fixed_rate;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    router.push({
      pathname: '/talentdetails/[slug]',
      params: { slug: talent.slug },
    });
  };

  const handleCall = async () => {
    if (!phoneNumber) return;

    try {
      const url =
        Platform.OS === 'ios'
          ? `telprompt:${phoneNumber}`
          : `tel:${phoneNumber}`;

      await Linking.openURL(url);
    } catch (error) {
      console.log('Unable to call talent:', error);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Talent image */}
      <View style={styles.imageWrapper}>
        {image?.image_url ? (
          <Image
            source={{
              uri: optimizeCloudinaryImage(image.image_url, {
                width: 500,
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
              size={38}
              color={Mycolors.graycolor}
            />
          </View>
        )}

        <View
          style={[
            styles.availabilityBadge,
            !talent.is_available && styles.unavailableBadge,
          ]}
        >
          <View
            style={[
              styles.availabilityDot,
              !talent.is_available && styles.unavailableDot,
            ]}
          />
          <Text
            style={[
              styles.availabilityText,
              !talent.is_available && styles.unavailableText,
            ]}
          >
            {talent.is_available ? 'Available' : 'Unavailable'}
          </Text>
        </View>
      </View>

      {/* Main details */}
      <View style={styles.content}>
        <View style={styles.nameSection}>
          <Text
            style={styles.stageName}
            numberOfLines={1}
          >
            {talent.stage_name || 'Talented Performer'}
          </Text>

          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {talent.title}
          </Text>
        </View>

        {/* Rating and location */}
        <View style={styles.metaSection}>
          <View style={styles.ratingRow}>
            <Ionicons
              name="star"
              size={14}
              color={Mycolors.secondarycolor}
            />

            <Text style={styles.ratingText}>
              {rating.toFixed(1)}
            </Text>

            {reviewCount > 0 && (
              <Text style={styles.reviewText}>
                ({reviewCount})
              </Text>
            )}
          </View>

          {location ? (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#858B99"
              />

              <Text
                style={styles.locationText}
                numberOfLines={1}
              >
                {location}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divider} />

        {/* Price and actions */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>FROM</Text>

            <View style={styles.priceRow}>
              <Text style={styles.currency}>
                {talent.currency}
              </Text>

              <Text
                style={styles.price}
                numberOfLines={1}
              >
                {price ?? 'Contact'}
              </Text>
            </View>

            {price != null && (
              <Text style={styles.priceSuffix}>
                {talent.hourly_rate ? 'per hour' : 'starting rate'}
              </Text>
            )}
          </View>

          <View style={styles.actions}>
            {phoneNumber ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Call talent"
                hitSlop={6}
                onPress={(event) => {
                  // This callback is intentionally handled separately
                  // from the parent card navigation.
                  void handleCall();
                }}
                style={({ pressed }) => [
                  styles.callButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={Mycolors.primarycolor}
                />
              </Pressable>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={handlePress}
              style={({ pressed }) => [
                styles.viewButton,
                pressed && styles.buttonPressed,
              ]}
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    marginBottom: 14,
    borderRadius: 17,
    backgroundColor: Mycolors.whitecolor,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    shadowColor: Mycolors.blackcolor,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 2,
  },

  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },

  imageWrapper: {
    width: 112,
    alignSelf: 'stretch',
    minHeight: 154,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F2F5',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  availabilityBadge: {
    position: 'absolute',
    left: 5,
    right: 5,
    bottom: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.96)',
  },

  unavailableBadge: {
    backgroundColor: 'rgba(255,255,255,0.96)',
  },

  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Mycolors.greencolor,
  },

  unavailableDot: {
    backgroundColor: '#8A8F9C',
  },

  availabilityText: {
    color: Mycolors.greencolor,
    fontSize: 9,
    fontWeight: '800',
  },

  unavailableText: {
    color: '#777C87',
  },

  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },

  nameSection: {
    minWidth: 0,
  },

  stageName: {
    color: Mycolors.primarycolor,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.3,
  },

  title: {
    color: '#626978',
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    marginTop: 4,
  },

  metaSection: {
    marginTop: 10,
    gap: 6,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  ratingText: {
    color: Mycolors.primarycolor,
    fontSize: 11,
    fontWeight: '800',
  },

  reviewText: {
    color: '#9298A4',
    fontSize: 10,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },

  locationText: {
    flex: 1,
    minWidth: 0,
    color: '#858B99',
    fontSize: 10,
    fontWeight: '500',
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ECEEF2',
    marginTop: 10,
    marginBottom: 9,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },

  priceContainer: {
    flex: 1,
    minWidth: 0,
  },

  priceLabel: {
    color: '#9298A4',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    marginTop: 2,
  },

  currency: {
    color: Mycolors.primarycolor,
    fontSize: 10,
    fontWeight: '700',
  },

  price: {
    flexShrink: 1,
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '900',
  },

  priceSuffix: {
    color: '#9298A4',
    fontSize: 9,
    marginTop: 1,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  callButton: {
    width: 34,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F2F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E8EF',
  },

  viewButton: {
    minHeight: 36,
    paddingHorizontal: 9,
    borderRadius: 10,
    backgroundColor: Mycolors.secondarycolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  viewButtonText: {
    color: Mycolors.primarycolor,
    fontSize: 10,
    fontWeight: '900',
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },
});

