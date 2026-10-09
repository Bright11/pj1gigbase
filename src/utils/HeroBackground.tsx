
import React from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { Mycolors } from '@/constants/mycolors';

export default function HeroBackground() {
  return (
    <ImageBackground
      source={require('@/assets/images/herobg.avif')}
      style={styles.hero}
      imageStyle={styles.heroImage}
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      <View style={styles.content}>

        {/* Small brand label */}
        <Text style={styles.eyebrow}>
          PJ1 GIGBASE
        </Text>

        {/* Main heading */}
        <Text style={styles.title}>
          Discover Global's
          {'\n'}
          <Text style={styles.highlight}>
            Creative Talent
          </Text>
        </Text>

        {/* Short description */}
        <Text style={styles.description}>
          Connect with talented professionals for your next
          project, event or creative experience.
        </Text>

        {/* Buttons */}
        <View style={styles.buttons}>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push('/services')}
          >
            <Text style={styles.primaryText}>
              Explore Talent
            </Text>

            <Text style={styles.arrow}>
              →
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push('/post-talent')}
          >
            <Text style={styles.secondaryText}>
              Join as Professional
            </Text>
          </Pressable>

        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    minHeight: 300,
    maxHeight: 320,

    overflow: 'hidden',
  },

  heroImage: {
    resizeMode: 'cover',
  },

  overlay: {
    ...StyleSheet.absoluteFill,

    backgroundColor: 'rgba(1, 4, 37, 0.78)',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 25,
  },

  eyebrow: {
    color: Mycolors.secondarycolor,

    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,

    marginBottom: 8,
  },

  title: {
    color: Mycolors.whitecolor,

    fontSize: 29,
    lineHeight: 34,

    fontWeight: '800',
  },

  highlight: {
    color: Mycolors.secondarycolor,
  },

  description: {
    color: Mycolors.graycolor,

    fontSize: 12,
    lineHeight: 18,

    marginTop: 10,

    maxWidth: 340,
  },

  buttons: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    marginTop: 18,
  },

  primaryButton: {
    flex: 1,

    minHeight: 46,

    backgroundColor: Mycolors.secondarycolor,

    borderRadius: 9,

    paddingHorizontal: 10,

    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'center',

    gap: 5,
  },

  primaryText: {
    color: Mycolors.primarycolor,

    fontSize: 12,
    fontWeight: '800',
  },

  arrow: {
    color: Mycolors.primarycolor,

    fontSize: 16,
    fontWeight: '800',
  },

  secondaryButton: {
    flex: 1,

    minHeight: 46,

    borderRadius: 9,

    borderWidth: 1,
    borderColor: Mycolors.secondarycolor,

    paddingHorizontal: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryText: {
    color: Mycolors.whitecolor,

    fontSize: 11,
    fontWeight: '700',

    textAlign: 'center',
  },
});

