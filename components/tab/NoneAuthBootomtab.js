import React from "react";

import { Tabs } from "expo-router";
import { Pressable } from "react-native";

import useUserdata from "@/components/getuserdata";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

function NoneAuthBootomtab() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.appcolor.promarycolor,
        tabBarInactiveTintColor: Colors.appcolor.text,
        // tabBarShowLabel:false,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: Colors.appcolor.begreen,
          paddingVertical: 8,
          paddingHorizontal: 5,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 11, // Customize your font size here

          fontWeight: "bold",
          fontFamily: "Poppins-bold",
          width: "100%",
          marginTop: 2,
          // textAlign: "center",
        },
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: "Home",
          //     headerShown:false,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="home-outline"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Services"
        options={{
          tabBarLabel: "Services",
          tabBarIcon: ({ focused, color }) => (
            <AntDesign
              name="customer-service"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          // tabBarButton: () => null,
          // tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}

export default NoneAuthBootomtab;
