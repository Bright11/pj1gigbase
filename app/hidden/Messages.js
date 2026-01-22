import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  FlatList,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  router,
  Stack,
  useGlobalSearchParams,
  useNavigation,
} from "expo-router";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import useUserdata from "@/components/getuserdata";

import CustomBtn from "@/components/headercutombtn/Custombtn";
import { SafeAreaView } from "react-native-safe-area-context";

const Messages = () => {
  const { fromid, tousername, toid } = useGlobalSearchParams();
  const userdata = useUserdata();
  const [allMessages, setAllMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [progress, setProgress] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tousername,
      headerTitleAlign: "center",
      headerLeft: () => (
        <Pressable style={{ paddingTop: 100 }} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
      ),
    });
  }, [tousername]);

  const flatListRef = useRef(null);

  useEffect(() => {
    if (fromid && toid && tousername) {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("fromid", "in", [fromid, toid]),
        where("toid", "in", [fromid, toid]),
        orderBy("timestamp", "asc"), // Change order to descending
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          let userMessages = [];
          querySnapshot.forEach((doc) => {
            userMessages.push({ id: doc.id, ...doc.data() });
          });
          setAllMessages(userMessages);
          // Scroll to the end after updating messages
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        },
        (error) => {
          console.log("Error fetching messages:", error);
        },
      );

      // Cleanup listener on unmount
      return () => unsubscribe();
    }
  }, [fromid, toid, tousername]);

  const sendMessage = async () => {
    if (messageText.trim() === "") return;

    try {
      setProgress(true);

      await addDoc(collection(db, "messages"), {
        content: messageText,
        tousername: tousername,
        fromusername: userdata?.username,
        fromid: fromid,
        toid: toid,
        userprofile: userdata?.userprofile,
        timestamp: new Date(),
      });

      await setDoc(doc(db, "lastmessage", toid + fromid), {
        content: messageText,
        tousername: tousername,
        fromusername: userdata?.username,
        fromid: fromid,
        toid: toid,
        userprofile: userdata?.userprofile,
        timestamp: new Date(),
      });

      setMessageText("");
    } catch (error) {
      console.log("Error sending message:", error);
    } finally {
      setProgress(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {/* <CustomBtn text="Chat" /> */}
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={allMessages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.flatListContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                style={
                  item.fromid === userdata?.userId
                    ? styles.ownerchat
                    : styles.visitorchat
                }
              >
                <Text>{item.content}</Text>
              </View>
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your message"
              value={messageText}
              onChangeText={setMessageText}
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <Pressable
              onPress={sendMessage}
              disabled={progress}
              style={styles.sendButton}
            >
              <Ionicons
                name="send-sharp"
                size={24}
                color={progress ? "gray" : "white"}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  flatListContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  ownerchat: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: "60%",
    marginLeft: "auto",
    marginRight: 10,
    backgroundColor: "#CCEFC8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visitorchat: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: "60%",
    marginRight: "auto",
    marginLeft: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "black",
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: Platform.OS === "ios" ? 20 : 8,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default Messages;
