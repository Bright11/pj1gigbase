import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Pressable,
} from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';

import type { PublicTalent } from '@/types/Talent';
import { getPublicTalentBySlug } from '@/services/talent.service';
import { getApiErrorMessage } from '@/services/api.error';
import { Mycolors } from '@/constants/mycolors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { createConversation } from '@/services/chat.service';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GALLERY_HEIGHT = 340;

// Shown/dialed when a talent hasn't listed their own number yet, so the
// "Call" action always does something useful instead of disappearing.
// TODO: move to a config/env value once the business line is finalized.
const FALLBACK_PHONE = '+233543461813';

// Placeholder copy until the API exposes a real description field.
// TODO: once available, replace every use of HARDCODED_DESCRIPTION below
// with `talent.description` (or whatever the field ends up being named),
// and delete this constant.
const HARDCODED_DESCRIPTION =
  'A versatile performer known for bringing energy, professionalism, ' +
  'and a personal touch to every event — from intimate gatherings to ' +
  'large-scale productions.';

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
// Kept outside the screen component so they don't get redefined (and their
// internal state / player instances reset) on every parent re-render.

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

function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <View
      style={[
        styles.badge,
        isAvailable ? styles.badgeAvailable : styles.badgeUnavailable,
      ]}
    >
      <View
        style={[
          styles.badgeDot,
          { backgroundColor: isAvailable ? '#22C55E' : '#9CA3AF' },
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          { color: isAvailable ? '#16A34A' : '#6B7280' },
        ]}
      >
        {isAvailable ? 'Available now' : 'Unavailable'}
      </Text>
    </View>
  );
}

// Bouncing "swipe" arrow: nudges a few pixels left and right, in a loop,
// to signal there's more to scroll to. Motion catches the eye far more
// reliably on a first glance than a static badge or dot indicator does —
// this disappears permanently the moment the user actually scrolls.
function SwipeArrowHint({ visible }: { visible: boolean }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    loopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: 8,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 550,
          useNativeDriver: true,
        }),
      ]),
    );
    loopRef.current.start();

    return () => loopRef.current?.stop();
  }, [translateX]);

  useEffect(() => {
    if (!visible) {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => loopRef.current?.stop());
    }
  }, [visible, opacity]);

  return (
    <Animated.View
      style={[
        styles.swipeHint,
        { opacity, transform: [{ translateX }] },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.swipeHintArrow}>›</Text>
    </Animated.View>
  );
}

function Gallery({
  images,
  fallbackUri,
}: {
  images: { id: string | number; image_url: string | null }[];
  fallbackUri: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasImages = images.length > 0;
  const isMultiImage = images.length > 1;

  // Tracks whether the user has interacted yet, so the arrow hint and
  // "Swipe" caption disappear permanently after the first scroll.
  const [hasScrolled, setHasScrolled] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / SCREEN_WIDTH,
    );
    if (index !== activeIndex) setActiveIndex(index);
  };

  const onScrollBeginDrag = () => {
    if (!hasScrolled) setHasScrolled(true);
  };

  if (!hasImages && !fallbackUri) {
    return (
      <View style={[styles.gallerySection, styles.noImage]}>
        <Text style={styles.noImageText}>No image available</Text>
      </View>
    );
  }

  const singleImage = !hasImages && fallbackUri;

  return (
    <View style={styles.gallerySection}>
      {singleImage ? (
        <Image source={{ uri: fallbackUri! }} style={styles.galleryImage} />
      ) : (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            onScroll={onScroll}
            onScrollBeginDrag={onScrollBeginDrag}
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

          {isMultiImage ? (
            <View style={styles.pagination} pointerEvents="none">
              {images.map((image, i) => (
                <View
                  key={image.id}
                  style={[
                    styles.paginationDot,
                    i === activeIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </>
      )}

      {/* Real gradient scrim: keeps the transparent header legible over
          bright photos without a flat, obviously-fake overlay tint. Two
          stops (top-down) so it fades out well before the midpoint and
          never dulls the actual photo content. */}
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)']}
        locations={[0, 0.6]}
        style={styles.galleryScrim}
        pointerEvents="none"
      />

      {/* Second, subtler gradient at the bottom so the pagination dots
          stay readable against light-colored photos too. */}
      {isMultiImage && (
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.35)']}
          locations={[0.6, 1]}
          style={styles.galleryBottomScrim}
          pointerEvents="none"
        />
      )}

      {/* Counter pill — secondary confirmation of position/total. */}
      {isMultiImage && (
        <View style={styles.imageCounter} pointerEvents="none">
          <Text style={styles.imageCounterText}>
            {activeIndex + 1}/{images.length}
          </Text>
        </View>
      )}

      {/* Primary "you can scroll" signal — a bouncing arrow, only shown
          before the first interaction and only when there's more than
          one image to scroll to. */}
      {isMultiImage && !hasScrolled && (
        <SwipeArrowHint visible={!hasScrolled} />
      )}
    </View>
  );
}

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
      <View style={styles.rateItem}>
        <Text style={styles.rateLabel}>HOURLY RATE</Text>
        <Text style={styles.rateValue}>
          {currency} {hourlyRate}
          <Text style={styles.rateSuffix}> /hr</Text>
        </Text>
      </View>

      <View style={styles.rateDivider} />

      <View style={styles.rateItem}>
        <Text style={styles.rateLabel}>FIXED RATE</Text>
        <Text style={styles.rateValue}>
          {currency} {fixedRate}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function TalentDetailsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
 
  
  useLayoutEffect(() => {
    navigation.setOptions({
      // title: talent?.stage_name ?? 'Talent Details',
       title: "",
      headerTransparent: true,
      headerTintColor: Mycolors.whitecolor,
      headerShown:true,
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerBookButton}
          activeOpacity={0.85}
          onPress={()=> navigation.goBack()}
        >
           <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
      //  headerLfet: () => (
      //   <TouchableOpacity
      //     style={styles.headerBookButton}
      //     activeOpacity={0.85}
      //   >
      //     <Text style={styles.headerBookButtonText}>Book</Text>
      //   </TouchableOpacity>
      // ),
    });
    // `talent` is intentionally the only reactive dependency besides
    // `navigation` — headerRight's onPress is wired up separately below
    // once booking is implemented, so it doesn't need to be in this array.
  }, [navigation]);


  const [talent, setTalent] = useState<PublicTalent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 


 const user = useAuthStore(
  (state) => state.user
);

// const isAuthenticated = useAuthStore(
//   (state) => state.isAuthenticated,
// );

// const isLoading = useAuthStore(
//   (state) => state.isLoading,
// );



  const isOwnTalent= user?.id ===talent?.user_id
  // Fade the whole screen in once data lands — feels intentional rather
  // than a hard content pop after the spinner disappears.
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const insets = useSafeAreaInsets()
  const actionleft =12

  useEffect(() => {
   
    const loadTalent = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        const data = await getPublicTalentBySlug(slug);
        setTalent(data);
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    loadTalent();
  }, [slug]);

  useEffect(() => {
    if (talent) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [talent, fadeAnim]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Mycolors.primarycolor} />
      </View>
    );
  }

  if (error || !talent) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>
          {error ?? 'Talent not found.'}
        </Text>
      </View>
    );
  }

  const images = talent.gallery_images.filter((image) => !!image.image_url);
  const videos = talent.video_details.filter((video) => !!video.video_url);
  const phoneNumber = talent.userprofile.phone_number?.trim();
  const profilePicture = talent.userprofile.profile_picture;
  const location = [talent.userprofile.city, talent.userprofile.country]
    .filter(Boolean)
    .join(', ');

  // Always resolves to something dialable — the talent's own number when
  // they have one, otherwise the platform fallback line.
  const callablePhone = phoneNumber || FALLBACK_PHONE;

  const handleCall = async (number: string) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch {
      Alert.alert('Unable to Call', 'This device cannot make phone calls.');
    }
  };

const handleChat = async () => {
  if (isOwnTalent) {
    return;
  }
 

  if (!user) {
    router.push('/(auth)/login');
    return;
  }

  try {
    const conversation = await createConversation(talent.id);

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


const handleBook = () => {
  if (!talent) return;

  router.push({
    pathname: '/booking/[talentId]',
    params: {
      talentId: talent.slug,
      // slug:talent.slug
    },
  });
};

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Gallery images={images} fallbackUri={profilePicture ?? null} />

      {/* Identity card overlaps the gallery bottom edge for a layered,
          "profile" feel instead of a flat stack of sections. */}
      <View style={styles.identityCard}>
        <View style={styles.nameRow}>
          <Text style={styles.stageName} numberOfLines={2}>
            {talent.stage_name}
          </Text>
        </View>

        <Text style={styles.title}>{talent.title}</Text>

        <View style={styles.metaRow}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingValue}>{talent.rating}</Text>
          </View>

          <Text style={styles.bookings}>
            {talent.total_bookings} bookings
          </Text>

          <AvailabilityBadge isAvailable={talent.is_available} />
        </View>
      </View>

      <RateCard
        currency={talent.currency}
        hourlyRate={talent.hourly_rate}
        fixedRate={talent.fixed_rate}
      />

      {location ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.bodyText}>{location}</Text>
        </View>
      ) : null}

      {talent.userprofile.bio ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bodyText}>{talent.userprofile.bio}</Text>
        </View>
      ) : null}

      {/* Hardcoded for now — see HARDCODED_DESCRIPTION above for the swap
          point once the API returns a real description field. Kept as
          its own section (separate from "About", which maps to the
          profile bio) since the two may end up being distinct fields. */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.bodyText}>{HARDCODED_DESCRIPTION}</Text>
      </View>

      {videos.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GIGBASE Videos</Text>
          {videos.map((video) => (
            <TalentVideo key={video.id} videoUrl={video.video_url!} />
          ))}
        </View>
      ) : null}

      {/* Spacer so content doesn't sit flush under the sticky action bar */}
      <View style={{ height: 90 +12}} />

      
        {!isOwnTalent &&(
          <>
          <View style={[styles.actions,{marginBottom:insets.bottom+12}]}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(callablePhone)}
          activeOpacity={0.8}
        >
          <Text style={styles.callButtonText} numberOfLines={1}>
            {phoneNumber ? 'Call' : callablePhone} 
          </Text>
        </TouchableOpacity>
          <TouchableOpacity
          style={styles.chatButton}
          onPress={handleChat}
          activeOpacity={0.8}
        >
          <Text style={styles.chatButtonText}>Chat </Text>
        </TouchableOpacity>

         
         </View>

         <View style={styles.bookingview_btn}>
         <TouchableOpacity
          style={styles.chatButton}
         onPress={handleBook}
          activeOpacity={0.8}
        >
          <Text style={styles.chatButtonText}> Book Talent </Text>
        </TouchableOpacity>
        </View>
         

         </>
        )}

        

        
     
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
    marginTop:70
  },

  content: {
    paddingBottom: 24,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 6,
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  errorText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
  },

  // --- Header --------------------------------------------------------

  headerBookButton: {
    backgroundColor: Mycolors.primarycolor,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },

  headerBookButtonText: {
    color: Mycolors.whitecolor,
    fontSize: 14,
    fontWeight: '700',
  },

  // --- Gallery ---------------------------------------------------------

  gallerySection: {
    width: '100%',
    height: GALLERY_HEIGHT,
    backgroundColor: '#F1F1F3',
  },

  galleryImage: {
    width: SCREEN_WIDTH,
    height: GALLERY_HEIGHT,
    resizeMode: 'cover',
  },

  galleryScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 130,
  },

  galleryBottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
  },

  pagination: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },

  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  paginationDotActive: {
    width: 18,
    backgroundColor: Mycolors.whitecolor,
  },

  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  imageCounterText: {
    fontSize: 12,
    fontWeight: '700',
    color: Mycolors.whitecolor,
  },

  swipeHint: {
    position: 'absolute',
    right: 14,
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  swipeHintArrow: {
    fontSize: 26,
    fontWeight: '700',
    color: Mycolors.whitecolor,
    marginLeft: 3, // optically center the ›, which has left-side bearing
  },

  noImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  noImageText: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // --- Identity card ---------------------------------------------------

  identityCard: {
    marginTop: -28,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: Mycolors.whitecolor,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stageName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  title: {
    marginTop: 4,
    fontSize: 15,
    color: '#6B7280',
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },

  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  ratingStar: {
    fontSize: 13,
    color: '#D97706',
  },

  ratingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
  },

  bookings: {
    fontSize: 13,
    color: '#6B7280',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  badgeAvailable: {
    backgroundColor: '#ECFDF5',
  },

  badgeUnavailable: {
    backgroundColor: '#F3F4F6',
  },

  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // --- Rates -------------------------------------------------------------

  rateCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#111827',
  },

  rateItem: {
    flex: 1,
  },

  rateDivider: {
    width: StyleSheet.hairlineWidth,
    marginHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  rateLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 6,
  },

  rateValue: {
    fontSize: 19,
    fontWeight: '800',
    color: Mycolors.whitecolor,
  },

  rateSuffix: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },

  // --- Content sections --------------------------------------------------

  section: {
    marginTop: 24,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.2,
  },

  bodyText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#374151',
  },

  videoCard: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  video: {
    width: '100%',
    aspectRatio: 16 / 9,
  },

  // --- Sticky actions ------------------------------------------------------

  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
   
    flexDirection: 'row',
    gap: 10,
    marginBottom:12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Mycolors.whitecolor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },

  callButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Mycolors.primarycolor,
    paddingHorizontal: 8,
  },

  chatButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.primarycolor,
  },

  callButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Mycolors.primarycolor,
  },

  chatButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Mycolors.whitecolor,
  },

  bookingview_btn:{
    marginTop:50,
    marginBottom:40,
  
  }
});