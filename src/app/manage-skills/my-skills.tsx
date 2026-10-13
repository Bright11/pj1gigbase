import { View, Text, Pressable } from 'react-native'
import React, { useLayoutEffect } from 'react'
import ManageSkillsScreen from '@/features/skills/ManageSkillsScreen'
import { useNavigation } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ProtectedRoute } from '@/utils/ProtectedRoute';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Myskills() {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: '',
      headerStyle: {
        backgroundColor: '#fff',
      },
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={{
            marginLeft: 10,
            padding: 8,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#000"
          />
        </Pressable>
      ),
      headerRight: () => (
        <Text style={{ marginLeft: 10, fontSize: 16, color: '#000' }}>My Skills</Text>
      ),
    });
  }, [navigation]);
  return (
    <ProtectedRoute>
       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
           <StatusBar style="auto" />
   <ManageSkillsScreen/>
   </SafeAreaView>
   </ProtectedRoute>
  )
}