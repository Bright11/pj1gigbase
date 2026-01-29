import React from "react";

import { Tabs } from "expo-router";
import { Platform, Pressable } from "react-native";

import useUserdata from "@/components/getuserdata";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaFrame } from "react-native-safe-area-context";

function MyBottomTabsNav() {
  const insets = useSafeAreaFrame();
  const userdata = useUserdata();
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
          // height: 60,
          // paddingBottom: 12,
          paddingTop: 6,
          paddingBottom: Platform.OS === "android" ? 10 : 0,
          height: Platform.OS === "android" ? 70 : 60,
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
      {/* <Tabs.Screen
        name="Saved"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <AntDesign
              name="save"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarLabel: "Saved",
          // href:userdata?.islogedin?true:null
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          // tabBarButton: (props) =>
          //     userdata?.islogedin ? <Pressable {...props} /> : null,
        }}
      /> */}

      <Tabs.Screen
        name="Sell"
        options={{
          tabBarLabel: "Ads",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          // href:userdata?.islogedin?true:null
          tabBarButton: (props) =>
            userdata?.islogedin ? <Pressable {...props} /> : null,
          // headerLeft: () => null,
          headerLeft: () => null,
          headerBackVisible: false,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <FontAwesome5
              name="user"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: (props) =>
            userdata?.islogedin ? <Pressable {...props} /> : null,
        }}
      />
      {/* <Tabs.Screen
        name="Messages"
        options={{
          tabBarLabel: "Messages",
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="message-square"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="Advertcategory"
        options={{
          tabBarLabel: "Category",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
          // href: null,
        }}
      /> */}

      {/* <Tabs.Screen
        name="Myregion"
        options={{
          tabBarLabel: "Regions",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="Uploadvideo"
        options={{
          tabBarLabel: "video upload",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="[Servicedetails]"
        options={{
          title: "Post details",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="mymessages"
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="message-square"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          // display: userdata?.isLoggedin ? 'flex' : 'none',
          tabBarButton: (props) =>
            userdata?.islogedin ? <Pressable {...props} /> : null,
        }}
      /> */}

      {/* <Tabs.Screen
        name="Mypost"
        options={{
          // tabBarLabel:"Chat",
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="message-square"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          // display: userdata?.isLoggedin ? 'flex' : 'none',
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="Editpost"
        options={{
          tabBarLabel: "Pictures",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}

      {/* <Tabs.Screen
        name="Userbio"
        options={{
          tabBarLabel: "Userbio",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name="add-circle-sharp"
              size={24}
              color={focused ? "black" : "white"}
            />
          ),
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      /> */}
    </Tabs>
  );
}

export default MyBottomTabsNav;
