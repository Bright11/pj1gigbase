import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native"; // Added Text

const CustomBtn = ({ link, text }) => {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          // Corrected: Pass the string directly or use pathname
          router.replace(link);
        }}
      >
        {/* Corrected: AntDesign uses 'left' or 'arrowleft' */}
        <AntDesign name="arrow-left" size={24} color="black" />
      </TouchableOpacity>

      <View>
        <Text style={styles.headerText}>{text}</Text>
      </View>
    </View>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Better than display: flex for RN
    justifyContent: "space-between",
    alignItems: "center", // Keeps icon and text aligned vertically
    backgroundColor: "white",
    padding: 10,
    marginBottom: 15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
    width: "100%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
