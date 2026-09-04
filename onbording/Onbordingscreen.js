import React, { useState, useMemo } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const onboardingSteps = [
  { title: "Discover", description: "Connect with skilled artists", icon: "people-arrows" },
  { title: "Book", description: "Schedule a lesson with a skilled artist", icon: "connectdevelop" },
  { title: "Connect", description: "Connect with other artists and learn from their experiences", icon: "dove" },
];

const OnboardingScreen = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const translateX = useSharedValue(0);

  const data = useMemo(() => onboardingSteps[screenIndex], [screenIndex]);

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem("alreadyUser", "true");
      router.replace("/(tabs)/Home");
    } catch (error) {
      console.error("Error saving user state:", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (screenIndex === onboardingSteps.length - 1) {
      completeOnboarding();
    } else {
      setScreenIndex(prev => prev + 1);
    }
  };

  const isLastScreen = screenIndex === onboardingSteps.length - 1;

  // Gesture handler using the updated Gesture API
  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      try {
        if (translateX.value > 100 && screenIndex > 0) {
          runOnJS(setScreenIndex)(screenIndex - 1);
        } else if (translateX.value < -100 && screenIndex < onboardingSteps.length - 1) {
          runOnJS(setScreenIndex)(screenIndex + 1);
        }
        translateX.value = withSpring(0);
      } catch (error) {
        console.error("Error handling gesture end:", error);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar translucent backgroundColor="#15141A" barStyle="light-content" />

      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((_, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              { backgroundColor: index === screenIndex ? "#F3B408" : "#707070" }
            ]}
          />
        ))}
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.pageContainer, animatedStyle]}>
          <FontAwesome5 style={styles.image} name={data.icon} size={70} color="#CEF202" />

          <View style={styles.footer}>
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{data.title}</Text>
              <Text style={styles.description}>{data.description}</Text>
            </View>

            <View style={styles.buttonRow}>
              {!isLastScreen && (
                <Pressable 
                  onPress={completeOnboarding} 
                  style={styles.skipButton} 
                  disabled={loading}
                >
                  <Text style={styles.skipButtonText}>Skip</Text>
                </Pressable>
              )}
              <Pressable 
                onPress={handleContinue} 
                style={styles.button} 
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {isLastScreen ? "Get Started" : "Continue"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#15141A",
  },
  pageContainer: {
    padding: 20,
    flex: 1,
  },
  image: {
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  contentContainer: {
    marginBottom: 50,
  },
  title: {
    color: "#FDFDFD",
    fontSize: 35,
    fontWeight: "500",
    fontFamily: "Poppins-bold",
    letterSpacing: 1.3,
    marginBottom: 10,
  },
  description: {
    color: "#D3D3D3",
    fontSize: 18,
    fontFamily: "Poppins-bold",
    lineHeight: 28,
  },
  footer: {
    marginTop: "auto",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#F3B408",
    borderRadius: 20,
    alignItems: "center",
    flex: 1,
    elevation: 3,
  },
  skipButton: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 48, // Ensuring the touch target is at least 48dp in height
    
  },
  buttonRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  buttonText: {
    fontFamily: "Poppins-bold",
    fontSize: 16,
    color: "#FFFFFF",
    padding: 15,
    paddingHorizontal: 25,
  },
  skipButtonText: {
    fontFamily: "Poppins-bold",
    fontSize: 16,
    color: "#707070",
  },
  stepIndicator: {
    width: 100,
    height: 3,
    margin: 5,
    flex: 1,
    borderRadius: 10,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 7,
    marginTop: 50,
    paddingHorizontal: 20,
  },
});

export default OnboardingScreen;
