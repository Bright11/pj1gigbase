import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, View, Text, StatusBar, SafeAreaView, StyleSheet } from "react-native";
import { router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from './onbording/Onbordingscreen';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserExisting, setIsUserExisting] = useState(false);

  const checkUser = async () => {
    try {
      const alreadyUser = await AsyncStorage.getItem("alreadyUser");
      setIsUserExisting(alreadyUser === "true");
    } catch (error) {
      console.error("Error checking user:", error);
      Alert.alert("Error", "Something went wrong while checking user.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!isLoading && isUserExisting) {
      router.replace("/(tabs)/Home");
    }
  }, [isLoading, isUserExisting]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar translucent backgroundColor="#15141A" barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F3B408" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar translucent backgroundColor="#15141A" barStyle="light-content" />
      <Stack.Screen options={{ headerShown: false }} />
      <OnboardingScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#15141A',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-bold',
  },
});