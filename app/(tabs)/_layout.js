import React from "react";

import { Tabs } from "expo-router";
import { Pressable } from "react-native";

import useUserdata from "@/components/getuserdata";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyBottomTabsNav from "../../components/tab/BottomTabsNav";
import NoneAuthBootomtab from "../../components/tab/NoneAuthBootomtab";

export default function Taplayout() {
  const userdata = useUserdata();
  if (!userdata) return <NoneAuthBootomtab />;
  return <MyBottomTabsNav />;
}
