import { StyleSheet, Text, View, Pressable, Alert, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { query, collection, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from '@/components/firebase/Firebaseconfig';
import { router, useNavigation } from 'expo-router';
import useUserdata from './../../components/getuserdata';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmailAuthProvider, reauthenticateWithCredential, signOut } from 'firebase/auth';
import * as Updates from 'expo-updates';
import { SafeAreaView } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

const Deleteaccount = () => {
  const navigation = useNavigation();
  const userdata = useUserdata(); // Get current user's data
  const user = auth?.currentUser;

  const [showReauth, setShowReauth] = useState(false);
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userdata?.username,
      headerTitleStyle: { fontWeight: 'bold' },
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Pressable onPress={() => router.replace("/Userdetails")}>
          <AntDesign name="arrowleft" size={35} color="black" />
        </Pressable>
      ),
    });
  }, [navigation]);

  const removlocaldata=async()=>{
    await AsyncStorage.multiRemove([
      "islogedin",
      "username",
      "userId",
      "pnumber",
      "email",
      "servicetype",
      "userprofile"
    ]);
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        removlocaldata()
        router.replace("/(tabs)/Home");
      }
    });
    return () => unsubscribe();
  }, []);

  const reauthenticateUser = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
      console.log("Re-authentication successful");
      setIsReauthenticated(true); // Update re-authentication status
      setShowReauth(false); // Hide re-authentication fields
    } catch (error) {
      console.error("Re-authentication failed:", error);
      Alert.alert("Authentication Error", "Re-authentication failed. Please check your credentials and try again.");
    }
  };

  const deleteUser = async () => {
    if (!isReauthenticated) {
      Alert.alert("Re-authentication Required", "Please re-authenticate to proceed with account deletion.");
      setShowReauth(true); // Prompt for re-authentication if not done
      return;
    }
    
    try {
      await user.delete();
      console.log("Account deleted successfully");
      await auth.signOut();
      console.log("Signed out successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      Alert.alert("Error", "Could not delete account. Please try again.");
    }
  };

  const deleteMessagesByUser = async () => {
    try {
      const messagesRef = collection(db, "lastmessage");
      const q = query(messagesRef, where("toid", "==", userdata?.userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          await deleteDoc(doc(db, "lastmessage", docSnap.id));
        });
        console.log("Messages deleted successfully");
      } else {
        console.log("No messages to delete.");
      }
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
          if (!isReauthenticated) {
            Alert.alert("Re-authentication Required", "Please re-authenticate to delete your account.");
            setShowReauth(true); // Prompt re-authentication
            return;
          }

          try {
            const q1 = query(collection(db, "post"), where("userId", "==", userdata?.userId));
            const querySnapshot = await getDocs(q1);

            if (!querySnapshot.empty) {
              querySnapshot.forEach(async (docSnap) => {
                await deleteDoc(doc(db, "post", docSnap.id));
              });
              console.log("Posts deleted successfully");
            } else {
              console.log("No posts to delete.");
            }

            await deleteMessagesByUser();
            await deleteUser();
            await AsyncStorage.multiRemove([
              "islogedin",
              "username",
              "userId",
              "pnumber",
              "email",
              "servicetype",
              "userprofile"
            ]);
          //  router.replace("/(tabs)/Home");
          await Updates.reloadAsync();
            console.log("Account and related data deleted successfully");
          } catch (error) {
            console.error("Error deleting posts:", error);
          }
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
    <View style={styles.viewcontainer}>
      <Text>Remember, a deleted account cannot be restored</Text>
      {showReauth ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Pressable  style={[styles.userudatebtn, { backgroundColor: "red" }]} onPress={reauthenticateUser}>
            <Text style={{ color: "white" }}>Re-authenticate</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={[styles.userudatebtn, { backgroundColor: "red" }]} onPress={deleteAccount}>
          <Text style={{ color: "white" }}>Delete Account <Entypo name="trash" size={24} color="white" /></Text>
        </Pressable>
      )}
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
  
};

export default Deleteaccount;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Add this
    width:"100%",
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    paddingHorizontal:16,
    paddingVertical:16,
    borderRadius:10,
    backgroundColor:"#f8f9fa",
    elevation:5,
    // Remove marginBottom:100 and paddingBottom:100
},
  viewcontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  userudatebtn: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    alignItems: 'center',
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
    width: "100%",
    marginBottom: 50,
  }
});
