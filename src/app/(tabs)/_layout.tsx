import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Mycolors } from '@/constants/mycolors';
import {  Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect } from 'react';
import { restoreSession } from '@/services/auth.session';


function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={[styles.tabBarContainer, { backgroundColor: Mycolors.primarycolor }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.tabBarLabel ?? options.title ?? route.name;
        
        // 🟢 EDIT THIS LINE: Change the color for the active (isFocused) state
        const currentColor = isFocused ? Mycolors.secondarycolor : Mycolors.graycolor;

        // ... keeping the rest of your onPress handler the same ...
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) { navigation.navigate(route.name, route.params); }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.tabItem}>
            {options.tabBarIcon && options.tabBarIcon({ color: currentColor, size: 22 })}
            <Text style={[styles.tabLabel, { color: currentColor }]}>
              {label}
            </Text>
            {isFocused && (
              <View style={[styles.indicator, { backgroundColor: Mycolors.secondarycolor }]} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  useEffect(()=>{
    restoreSession()
  },[])
  return (

<Tabs

tabBar={(props) => <CustomTabBar {...props} />}
  screenOptions={{
    
    headerStyle: {
      backgroundColor: Mycolors.primarycolor,
    },
    headerShown: false,
 
    tabBarStyle: {
    }
  }}
  // hide the default tab bar
 
>

    <Tabs.Screen
    name="index"
    options={{
      // tabBarStyle: { display: 'none' }, // Hides the default tab bar for this screen
      title: 'index',
       tabBarIcon: ({ color, size }) => (
       <AntDesign name="home" size={24} color="white" />
      )
    
    }}

  />
  {/* <Tabs.Screen
    name="home"
    options={{
      // tabBarStyle: { display: 'none' }, // Hides the default tab bar for this screen
      title: 'Home',
       tabBarIcon: ({ color, size }) => (
       <AntDesign name="home" size={24} color="white" />
      )
    
    }}

  /> */}
  <Tabs.Screen
    name="profile"
    options={{
      title: 'Profile',
      tabBarIcon: ({ color, size }) => (
       <AntDesign name="profile" size={24} color="white" />
      )
    }}
  />
  <Tabs.Screen
    name="services"
    options={{
      title: 'Services',
      tabBarIcon: ({ color, size }) => (
       <FontAwesome name="play-circle-o" size={24} color="white" />
      )
    }}
  />
  <Tabs.Screen
    name="dashboard"
    options={{
      title: 'Dashboard',
      tabBarLabel: 'Dashboard',
      tabBarIcon: () => (
     <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Mycolors.secondarycolor, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 }}>
       <AntDesign name="dashboard" size={24} color="white" />
     </View>
      )
    }}
  />

</Tabs> 

);
}


const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 120, // Bumped slightly to comfortably fit icon + label
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 2, // Keeps spacing between the icon and label tight
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: '35%',
    height: 3,
    borderRadius: 2,
  },
});