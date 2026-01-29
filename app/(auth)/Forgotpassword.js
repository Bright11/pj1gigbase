import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useNavigation } from "expo-router";

export default function Forgotpassword() {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View>
        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text>Back</Text>
        </Pressable>
      </View>
      <KeyboardAvoidingView>
        <View>
          <Text>Forgotpassword</Text>
          <TextInput placeholder="Enter your email" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({});
