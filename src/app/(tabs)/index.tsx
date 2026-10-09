
import React, { useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';

import { Mycolors } from '@/constants/mycolors';
import Category from '@/features/talents/Category';
import { useAuthStore } from '@/store/auth.store';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (!user) {
      navigation.setOptions({
        headerShown: true,
        headerTitle: '',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: Mycolors.primarycolor,
        },

        headerLeft: () => (
          <View style={styles.brandContainer}>
            <View style={styles.logoCircle}>
              <Ionicons
                name="musical-notes"
                size={18}
                color={Mycolors.primarycolor}
              />
            </View>

            <View>
              <Text style={styles.brandName}>PJ1</Text>
              <Text style={styles.brandSubtitle}>GIGBASE</Text>
            </View>
          </View>
        ),

        headerRight: () => (
          <Pressable
            onPress={() => router.push('/login')}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
            ]}
          >
            <Ionicons
              name="log-in-outline"
              size={19}
              color={Mycolors.primarycolor}
            />

            <Text style={styles.loginText}>Login</Text>
          </Pressable>
        ),
      });
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [user, navigation]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top']}
    >
      <Category />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Mycolors.whitecolor,
  },

  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },

  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Mycolors.secondarycolor,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  brandName: {
    color: Mycolors.whitecolor,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 17,
    letterSpacing: 0.5,
  },

  brandSubtitle: {
    color: Mycolors.secondarycolor,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    lineHeight: 11,
  },

  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Mycolors.secondarycolor,
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 14,
    gap: 6,
  },

  loginButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  loginText: {
    color: Mycolors.primarycolor,
    fontSize: 14,
    fontWeight: '800',
  },
});

