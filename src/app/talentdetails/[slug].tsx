import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PublicTalent } from '@/types/Talent';
import { getPublicTalentBySlug } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Mycolors } from '@/constants/mycolors';
import { useAuthStore } from '@/store/auth.store';
import { createConversation } from '@/services/chat.service';
import TalentReviewSection from '@/features/reviews/TalentReviewSection';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GALLERY_HEIGHT = 380;

const FALLBACK_PHONE = '+233543461813';

const HARDCODED_DESCRIPTION =
  'A versatile performer known for bringing energy, professionalism, ' +
  'and a personal touch to every event — from intimate gatherings to ' +
  'large-scale productions.';

/* -------------------------------------------------------------------------- */
/* VIDEO                                                                      */
/* -------------------------------------------------------------------------- */

function TalentVideo({ videoUrl }: { videoUrl: string }) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
  });

  return (
    <View style={styles.videoCard}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* AVAILABILITY                                                               */
/* -------------------------------------------------------------------------- */

function AvailabilityBadge({
  isAvailable,
}: {
  isAvailable: boolean;
}) {
  return (
    <View
      style={[
        styles.availabilityBadge,
        isAvailable
          ? styles.availabilityAvailable
          : styles.availabilityUnavailable,
      ]}
    >
      <View
        style={[
          styles.availabilityDot,
          {
            backgroundColor: isAvailable
              ? Mycolors.greencolor
              : Mycolors.graycolor,
          },
        ]}
      />

      <Text
        style={[
          styles.availabilityText,
          {
            color: isAvailable
              ? Mycolors.greencolor
              : '#6B7280',
          },
        ]}
      >
        {isAvailable ? 'Available' : 'Unavailable'}
      </Text>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* GALLERY                                                                    */
/* -------------------------------------------------------------------------- */

function Gallery({
  images,
  fallbackUri,
}: {
  images: {
    id: string | number;
    image_url: string | null;
  }[];
  fallbackUri: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images.length > 0;
  const isMultiImage = images.length > 1;

  const onScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (!hasImages && !fallbackUri) {
    return (
      <View style={styles.galleryEmpty}>
        <Ionicons
          name="image-outline"
          size={50}
          color={Mycolors.graycolor}
        />

        <Text style={styles.galleryEmptyText}>
          No image available
        </Text>
      </View>
    );
  }

  const singleImage = !hasImages && fallbackUri;

  return (
    <View style={styles.gallery}>
      {singleImage ? (
        <Image
          source={{ uri: fallbackUri! }}
          style={styles.galleryImage}
        />
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {images.map((image) => (
            <Image
              key={image.id}
              source={{ uri: image.image_url! }}
              style={styles.galleryImage}
            />
          ))}
        </ScrollView>
      )}

      {/* Dark gradient for readability */}
      <LinearGradient
        colors={[
          'rgba(1,4,37,0.65)',
          'rgba(1,4,37,0.08)',
          'rgba(1,4,37,0)',
        ]}
        locations={[0, 0.35, 0.75]}
        style={styles.galleryTopGradient}
        pointerEvents="none"
      />

      {/* Bottom gradient */}
      <LinearGradient
        colors={[
          'rgba(1,4,37,0)',
          'rgba(1,4,37,0.55)',
        ]}
        style={styles.galleryBottomGradient}
        pointerEvents="none"
      />

      {/* Image counter */}
      {isMultiImage && (
        <View style={styles.imageCounter}>
          <Ionicons
            name="images-outline"
            size={15}
            color={Mycolors.whitecolor}
          />

          <Text style={styles.imageCounterText}>
            {activeIndex + 1} / {images.length}
          </Text>
        </View>
      )}

      {/* Swipe hint */}
      {isMultiImage && (
        <View style={styles.swipeHint}>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Mycolors.whitecolor}
          />
          <Text style={styles.swipeHintText}>
            Swipe
          </Text>
        </View>
      )}

      {/* Pagination */}
      {isMultiImage && (
        <View style={styles.pagination}>
          {images.map((image, index) => (
            <View
              key={image.id}
              style={[
                styles.paginationDot,
                index === activeIndex &&
                  styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* PRICE CARD                                                                 */
/* -------------------------------------------------------------------------- */

function RateCard({
  currency,
  hourlyRate,
  fixedRate,
}: {
  currency: string;
  hourlyRate: number | string;
  fixedRate: number | string;
}) {
  return (
    <View style={styles.rateCard}>
      <View style={styles.rateHeader}>
        <View>
          <Text style={styles.rateSmallLabel}>
            TALENT RATES
          </Text>

          <Text style={styles.rateHeaderTitle}>
            Professional pricing
          </Text>
        </View>

        <View style={styles.priceIcon}>
          <Ionicons
            name="pricetag-outline"
            size={19}
            color={Mycolors.secondarycolor}
          />
        </View>
      </View>

      <View style={styles.rateContent}>
        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>
            HOURLY
          </Text>

          <Text style={styles.rateValue}>
            {currency} {hourlyRate}
          </Text>

          <Text style={styles.rateSuffix}>
            per hour
          </Text>
        </View>

        <View style={styles.rateDivider} />

        <View style={styles.rateItem}>
          <Text style={styles.rateLabel}>
            FIXED
          </Text>

          <Text style={styles.rateValue}>
            {currency} {fixedRate}
          </Text>

          <Text style={styles.rateSuffix}>
            per project
          </Text>
        </View>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* INFO ROW                                                                   */
/* -------------------------------------------------------------------------- */

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={18}
          color={Mycolors.primarycolor}
        />
      </View>

      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/* SCREEN                                                                     */
/* -------------------------------------------------------------------------- */

export default function TalentDetailsScreen() {
  const { slug } =
    useLocalSearchParams<{ slug: string }>();

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [talent, setTalent] =
    useState<PublicTalent | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fadeAnim =
    useRef(new Animated.Value(0)).current;

  const user = useAuthStore(
    (state) => state.user,
  );

  const isOwnTalent =
    user?.id === talent?.user_id;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTransparent: true,
      headerShown: true,
      headerTintColor: Mycolors.whitecolor,

      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={Mycolors.whitecolor}
          />
        </TouchableOpacity>
      ),

      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          activeOpacity={0.8}
          onPress={() => {
            if (!talent) return;

            router.push({
              pathname: '/booking/[talentId]',
              params: {
                talentId: talent.slug,
              },
            });
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={21}
            color={Mycolors.whitecolor}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, talent]);

  const loadTalent = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const data =
        await getPublicTalentBySlug(slug);

      setTalent(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTalent();
  }, [slug]);

  useEffect(() => {
    if (!talent) return;

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [talent, fadeAnim]);

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                 */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>
            PJ1
          </Text>
        </View>

        <ActivityIndicator
          size="small"
          color={Mycolors.secondarycolor}
        />

        <Text style={styles.loadingText}>
          Loading talent profile...
        </Text>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                   */
  /* ---------------------------------------------------------------------- */

  if (error || !talent) {
    return (
      <View style={styles.errorScreen}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={42}
            color={Mycolors.redcolor}
          />
        </View>

        <Text style={styles.errorTitle}>
          Talent unavailable
        </Text>

        <Text style={styles.errorMessage}>
          {error ?? 'Talent not found.'}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadTalent}
        >
          <Ionicons
            name="refresh-outline"
            size={18}
            color={Mycolors.whitecolor}
          />

          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* DATA                                                                    */
  /* ---------------------------------------------------------------------- */

  const images =
    talent.gallery_images.filter(
      (image) => !!image.image_url,
    );

  const videos =
    talent.video_details.filter(
      (video) => !!video.video_url,
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

  const callablePhone =
    phoneNumber || FALLBACK_PHONE;

  /* ---------------------------------------------------------------------- */
  /* CALL                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleCall = async (number: string) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch {
      Alert.alert(
        'Unable to Call',
        'This device cannot make phone calls.',
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* CHAT                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleChat = async () => {
    if (isOwnTalent) return;

    if (!user) {
      router.push('/(auth)/login');
      return;
    }

    try {
      const conversation =
        await createConversation(talent.id);

      router.push({
        pathname: '/chat/[conversationId]',
        params: {
          conversationId: conversation.id,
        },
      });
    } catch (error) {
      console.log(
        'Unable to start conversation:',
        error,
      );
    }
  };

  /* ---------------------------------------------------------------------- */
  /* BOOK                                                                    */
  /* ---------------------------------------------------------------------- */

  const handleBook = () => {
    router.push({
      pathname: '/booking/[talentId]',
      params: {
        talentId: talent.slug,
      },
    });
  };

  /* ---------------------------------------------------------------------- */
  /* UI                                                                      */
  /* ---------------------------------------------------------------------- */

  return (
    <View style={styles.screen}>
      <Animated.ScrollView
        style={{
          opacity: fadeAnim,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isOwnTalent
            ? 30
            : 125 + insets.bottom,
        }}
      >
        {/* HERO */}
        <Gallery
          images={images}
          fallbackUri={profilePicture ?? null}
        />

        {/* IDENTITY */}
        <View style={styles.identityCard}>
          {/* Username */}
          <View style={styles.usernameRow}>
            <View style={styles.usernameIcon}>
              <Ionicons
                name="person"
                size={12}
                color={Mycolors.primarycolor}
              />
            </View>

            <Text style={styles.username}>
              @{talent.user_details.username}
            </Text>
          </View>

          {/* Stage name */}
          <Text
            style={styles.stageName}
            numberOfLines={2}
          >
            {talent.stage_name}
          </Text>

          {/* Profession */}
          <Text style={styles.title}>
            {talent.title}
          </Text>

          {/* Availability */}
          <View style={styles.availabilityRow}>
            <AvailabilityBadge
              isAvailable={talent.is_available}
            />
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="star"
                  size={16}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <View>
                <Text style={styles.statValue}>
                  {talent.review_count ??
                    talent.reviews?.length ??
                    0}
                </Text>

                <Text style={styles.statLabel}>
                  Reviews
                </Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color={Mycolors.secondarycolor}
                />
              </View>

              <View>
                <Text style={styles.statValue}>
                  {talent.total_bookings}
                </Text>

                <Text style={styles.statLabel}>
                  Bookings
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* LOCATION */}
        {location ? (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              PROFILE
            </Text>

            <Text style={styles.sectionTitle}>
              About this talent
            </Text>

            <View style={styles.infoCard}>
              <InfoItem
                icon="location-outline"
                label="Based in"
                value={location}
              />
            </View>
          </View>
        ) : null}

        {/* BIO */}
        {talent.userprofile.bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              About
            </Text>

            <View style={styles.textCard}>
              <Text style={styles.bodyText}>
                {talent.userprofile.bio}
              </Text>
            </View>
          </View>
        ) : null}

        {/* RATES */}
        <View style={styles.section}>
          <RateCard
            currency={talent.currency}
            hourlyRate={talent.hourly_rate}
            fixedRate={talent.fixed_rate}
          />
        </View>

        {/* SKILLS */}
        {talent.skills?.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              EXPERTISE
            </Text>

            <Text style={styles.sectionTitle}>
              Skills & services
            </Text>

            <View style={styles.skillsContainer}>
              {talent.skills.map((item) => (
                <View
                  key={item.id}
                  style={styles.skillBadge}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color={Mycolors.greencolor}
                  />

                  <Text style={styles.skillText}>
                    {item.skill.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>
            DETAILS
          </Text>

          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <View style={styles.textCard}>
            <Text style={styles.bodyText}>
              {HARDCODED_DESCRIPTION}
            </Text>
          </View>
        </View>

        {/* VIDEOS */}
        {videos.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>
              SHOWCASE
            </Text>

            <Text style={styles.sectionTitle}>
              GIGBASE Videos
            </Text>

            {videos.map((video) => (
              <TalentVideo
                key={video.id}
                videoUrl={video.video_url!}
              />
            ))}
          </View>
        ) : null}

        {/* REVIEWS */}
        <View style={styles.reviewSection}>
          <TalentReviewSection
            talentId={talent.id}
            reviews={talent.reviews ?? []}
            reviewCount={talent.review_count ?? 0}
            isAuthenticated={!!user}
            onReviewSubmitted={loadTalent}
          />
        </View>
      </Animated.ScrollView>

      {/* ------------------------------------------------------------------ */}
      {/* BOTTOM ACTION BAR                                                  */}
      {/* ------------------------------------------------------------------ */}

      {!isOwnTalent && (
        <View
          style={[
            styles.bottomBar,
            {
              paddingBottom:
                Math.max(insets.bottom, 10) + 8,
            },
          ]}
        >
          <View style={styles.actionRow}>
            {/* CALL */}
            <Pressable
              style={({ pressed }) => [
                styles.secondaryAction,
                pressed && styles.actionPressed,
              ]}
              onPress={() =>
                handleCall(callablePhone)
              }
            >
              <Ionicons
                name="call-outline"
                size={21}
                color={Mycolors.primarycolor}
              />

              <Text style={styles.secondaryActionText}>
                Call
              </Text>
            </Pressable>

            {/* CHAT */}
            <Pressable
              style={({ pressed }) => [
                styles.secondaryAction,
                pressed && styles.actionPressed,
              ]}
              onPress={handleChat}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={21}
                color={Mycolors.primarycolor}
              />

              <Text style={styles.secondaryActionText}>
                Chat
              </Text>
            </Pressable>

            {/* BOOK */}
            <Pressable
              style={({ pressed }) => [
                styles.bookAction,
                pressed && styles.actionPressed,
              ]}
              onPress={handleBook}
            >
              <Ionicons
                name="calendar-outline"
                size={21}
                color={Mycolors.primarycolor}
              />

              <Text style={styles.bookActionText}>
                Book Talent
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  /* ---------------------------------------------------------------------- */
  /* LOADING                                                                 */
  /* ---------------------------------------------------------------------- */

  loadingScreen: {
    flex: 1,
    backgroundColor: Mycolors.primarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingLogo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Mycolors.secondarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  loadingLogoText: {
    color: Mycolors.primarycolor,
    fontSize: 22,
    fontWeight: '900',
  },

  loadingText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 12,
  },

  /* ---------------------------------------------------------------------- */
  /* ERROR                                                                   */
  /* ---------------------------------------------------------------------- */

  errorScreen: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FFF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: Mycolors.primarycolor,
    marginBottom: 8,
  },

  errorMessage: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 22,
  },

  retryButton: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: Mycolors.primarycolor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  retryText: {
    color: Mycolors.whitecolor,
    fontSize: 14,
    fontWeight: '800',
  },

  /* ---------------------------------------------------------------------- */
  /* HEADER                                                                  */
  /* ---------------------------------------------------------------------- */

  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(1,4,37,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },

  /* ---------------------------------------------------------------------- */
  /* GALLERY                                                                 */
  /* ---------------------------------------------------------------------- */

  gallery: {
    width: '100%',
    height: GALLERY_HEIGHT,
    backgroundColor: '#E5E7EB',
  },

  galleryImage: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    resizeMode: 'cover',
  },

  galleryTopGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 170,
  },

  galleryBottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },

  galleryEmpty: {
    height: GALLERY_HEIGHT,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  galleryEmptyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  imageCounter: {
    position: 'absolute',
    right: 16,
    bottom: 18,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: 'rgba(1,4,37,0.78)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  imageCounterText: {
    color: Mycolors.whitecolor,
    fontSize: 12,
    fontWeight: '800',
  },

  swipeHint: {
    position: 'absolute',
    left: 16,
    bottom: 18,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: 'rgba(1,4,37,0.68)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  swipeHintText: {
    color: Mycolors.whitecolor,
    fontSize: 11,
    fontWeight: '700',
  },

  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  paginationDotActive: {
    width: 19,
    backgroundColor: Mycolors.secondarycolor,
  },

  /* ---------------------------------------------------------------------- */
  /* IDENTITY                                                                */
  /* ---------------------------------------------------------------------- */

  identityCard: {
    marginHorizontal: 15,
    marginTop: -30,
    borderRadius: 22,
    backgroundColor: Mycolors.whitecolor,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,

    shadowColor: Mycolors.blackcolor,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.1,
    shadowRadius: 18,

    elevation: 6,
  },

  usernameRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  usernameIcon: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  username: {
    fontSize: 12,
    fontWeight: '700',
    color: Mycolors.primarycolor,
  },

  stageName: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '900',
    color: Mycolors.primarycolor,
    letterSpacing: -0.6,
  },

  title: {
    marginTop: 5,
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500',
  },

  availabilityRow: {
    marginTop: 14,
  },

  availabilityBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  availabilityAvailable: {
    backgroundColor: '#EEF9F2',
  },

  availabilityUnavailable: {
    backgroundColor: '#F3F4F6',
  },

  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  availabilityText: {
    fontSize: 12,
    fontWeight: '800',
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 19,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF8E6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statValue: {
    fontSize: 15,
    fontWeight: '900',
    color: Mycolors.primarycolor,
  },

  statLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },

  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 34,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },

  /* ---------------------------------------------------------------------- */
  /* SECTIONS                                                                */
  /* ---------------------------------------------------------------------- */

  section: {
    marginTop: 26,
    paddingHorizontal: 17,
  },

  sectionEyebrow: {
    color: Mycolors.secondarycolor,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginBottom: 4,
  },

  sectionTitle: {
    color: Mycolors.primarycolor,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  infoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECEEF2',
    backgroundColor: '#FAFAFB',
    padding: 15,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    color: Mycolors.primarycolor,
    fontWeight: '700',
  },

  textCard: {
    borderRadius: 16,
    backgroundColor: '#F8F9FB',
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Mycolors.secondarycolor,
  },

  bodyText: {
    color: '#374151',
    fontSize: 14.5,
    lineHeight: 23,
  },

  /* ---------------------------------------------------------------------- */
  /* RATES                                                                   */
  /* ---------------------------------------------------------------------- */

  rateCard: {
    borderRadius: 20,
    backgroundColor: Mycolors.primarycolor,
    padding: 18,
    overflow: 'hidden',
  },

  rateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  rateSmallLabel: {
    color: Mycolors.secondarycolor,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  rateHeaderTitle: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },

  priceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(247,185,40,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  rateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rateItem: {
    flex: 1,
  },

  rateDivider: {
    width: StyleSheet.hairlineWidth,
    height: 55,
    backgroundColor: 'rgba(255,255,255,0.16)',
    marginHorizontal: 15,
  },

  rateLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 5,
  },

  rateValue: {
    color: Mycolors.secondarycolor,
    fontSize: 20,
    fontWeight: '900',
  },

  rateSuffix: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 3,
  },

  /* ---------------------------------------------------------------------- */
  /* SKILLS                                                                  */
  /* ---------------------------------------------------------------------- */

  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#F7F9F7',
    borderWidth: 1,
    borderColor: '#E2EBDD',
  },

  skillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },

  /* ---------------------------------------------------------------------- */
  /* VIDEO                                                                   */
  /* ---------------------------------------------------------------------- */

  videoCard: {
    marginTop: 4,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Mycolors.blackcolor,
  },

  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },

  /* ---------------------------------------------------------------------- */
  /* REVIEWS                                                                 */
  /* ---------------------------------------------------------------------- */

  reviewSection: {
    marginTop: 30,
    paddingHorizontal: 17,
  },

  /* ---------------------------------------------------------------------- */
  /* BOTTOM ACTIONS                                                          */
  /* ---------------------------------------------------------------------- */

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(255,255,255,0.98)',

    borderTopWidth: 1,
    borderTopColor: '#E7E8EC',

    paddingHorizontal: 14,
    paddingTop: 10,

    shadowColor: Mycolors.blackcolor,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 12,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 9,
  },

  secondaryAction: {
    height: 52,
    minWidth: 74,
    paddingHorizontal: 12,

    borderRadius: 14,
    borderWidth: 1.3,
    borderColor: '#D9DDE7',

    backgroundColor: Mycolors.whitecolor,

    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  secondaryActionText: {
    color: Mycolors.primarycolor,
    fontSize: 13,
    fontWeight: '800',
  },

  bookAction: {
    flex: 1,
    height: 52,

    borderRadius: 14,

    backgroundColor: Mycolors.secondarycolor,

    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,

    shadowColor: Mycolors.secondarycolor,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 4,
  },

  bookActionText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '900',
  },

  actionPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
