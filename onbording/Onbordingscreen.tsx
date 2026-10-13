import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { Mycolors } from '@/constants/mycolors';

/* -------------------------------------------------------------------------- */
/* Config                                                                      */
/* -------------------------------------------------------------------------- */

/** Share this key with whatever reads it at app start (root layout / splash). */
export const ONBOARDING_STORAGE_KEY = 'alreadyUser';

const SWIPE_THRESHOLD = 80;

const FONT = 'Poppins-bold'; // keep in sync with the name you pass to useFonts

const COLORS = {
  background: Mycolors.primarycolor,
  accent: Mycolors.secondarycolor,
  title: Mycolors.whitecolor,
  body: Mycolors.graycolor,
  skip: Mycolors.graycolor,
  onAccent: Mycolors.primarycolor, // dark text on gold keeps contrast high
  inactive: 'rgba(255, 255, 255, 0.2)', // dim progress bars on navy
  iconBackground: 'rgba(247, 185, 40, 0.12)', // gold at low opacity
} as const;

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface OnboardingStep {
  title: string;
  description: string;
  icon: IconName;
}

const STEPS: readonly OnboardingStep[] = [
  {
    title: 'Discover',
    description: 'Connect with skilled artists',
    icon: 'search',
  },
  {
    title: 'Book',
    description: 'Schedule a lesson with a skilled artist',
    icon: 'calendar',
  },
  {
    title: 'Connect',
    description: 'Connect with other artists and learn from their experiences',
    icon: 'chatbubbles',
  },
];

const LAST_INDEX = STEPS.length - 1;

/* -------------------------------------------------------------------------- */
/* Screen                                                                      */
/* -------------------------------------------------------------------------- */

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const translateX = useSharedValue(0);

  const step = STEPS[index];
  const isLast = index === LAST_INDEX;

  const completeOnboarding = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
      // NOTE: your tabs folder has index.tsx, not Home.tsx.
      router.replace('/(tabs)');
    } catch (error) {
      if (__DEV__) console.error('Error saving onboarding state:', error);
      Alert.alert('Error', 'Something went wrong, please try again.');
      setLoading(false);
    }
  }, [loading, router]);

  const handleContinue = useCallback(() => {
    if (isLast) {
      completeOnboarding();
    } else {
      setIndex((prev) => Math.min(prev + 1, LAST_INDEX));
    }
  }, [isLast, completeOnboarding]);

  /**
   * Runs on the JS thread. Clamps with a functional update, so the gesture
   * never needs to read `index` (no stale-closure bug).
   */
  const goBy = useCallback((delta: 1 | -1) => {
    setIndex((prev) => Math.min(Math.max(prev + delta, 0), LAST_INDEX));
  }, []);

  const pan = useMemo(
    () =>
      Gesture.Pan()
        // Only claim clearly horizontal drags; leave vertical gestures alone.
        .activeOffsetX([-15, 15])
        .failOffsetY([-15, 15])
        .onUpdate((event) => {
          translateX.value = event.translationX * 0.4; // resistance
        })
        .onEnd((event) => {
          if (event.translationX < -SWIPE_THRESHOLD) {
            scheduleOnRN(goBy, 1);
          } else if (event.translationX > SWIPE_THRESHOLD) {
            scheduleOnRN(goBy, -1);
          }
          translateX.value = withSpring(0);
        }),
    [goBy, translateX],
  );

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView style={styles.page} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View
        style={styles.progress}
        accessible
        accessibilityLabel={`Step ${index + 1} of ${STEPS.length}`}
      >
        {STEPS.map((s, i) => (
          <View
            key={s.title}
            style={[
              styles.progressBar,
              { backgroundColor: i <= index ? COLORS.accent : COLORS.inactive },
            ]}
          />
        ))}
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.content, dragStyle]}>
          {/* key remounts this block so the entering animation replays per step */}
          <Animated.View
            key={index}
            entering={FadeIn.duration(250)}
            style={styles.stepBody}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={step.icon} size={56} color={COLORS.accent} />
            </View>

            <Text style={styles.title} accessibilityRole="header">
              {step.title}
            </Text>
            <Text style={styles.description}>{step.description}</Text>
          </Animated.View>

          <View style={styles.footer}>
            {!isLast && (
              <Pressable
                onPress={completeOnboarding}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Skip onboarding"
                hitSlop={8}
                style={styles.skipButton}
              >
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleContinue}
              disabled={loading}
              accessibilityRole="button"
              accessibilityState={{ busy: loading, disabled: loading }}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.onAccent} />
              ) : (
                <Text style={styles.buttonText}>
                  {isLast ? 'Get Started' : 'Continue'}
                </Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                      */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  progress: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
    paddingHorizontal: 24,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  stepBody: {
    flex: 1,
    justifyContent: 'center',
  },

  iconCircle: {
    alignSelf: 'center',
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    backgroundColor: COLORS.iconBackground,
  },

  title: {
    color: COLORS.title,
    fontSize: 34,
    fontFamily: FONT,
    letterSpacing: 1,
    marginBottom: 10,
  },
  description: {
    color: COLORS.body,
    fontSize: 18,
    fontFamily: FONT,
    lineHeight: 28,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  skipButton: {
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  skipText: {
    color: COLORS.skip,
    fontSize: 16,
    fontFamily: FONT,
  },
  button: {
    flex: 1,
    height: 52,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: COLORS.onAccent,
    fontSize: 16,
    fontFamily: FONT,
  },
});