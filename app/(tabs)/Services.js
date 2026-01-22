import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import Servicescomponet from "@/components/homecomponets/Servicescomponet";
import { router, useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

const Services = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Services",
      headerTitleAlign: "center",
      headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrow-left" size={34} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={{ flex: 1, marginBottom: 40 }}>
      <Servicescomponet />
    </View>
  );
};

export default Services;
