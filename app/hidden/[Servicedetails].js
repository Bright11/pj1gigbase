import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import { Colors } from "@/constants/Colors";
import { Audio, Video, ResizeMode } from "expo-av";
import Button from "@/components/botton/Button";
import PhoneNumber from "@/components/homecomponets/Number/PhoneNumber";
import { AntDesign } from "@expo/vector-icons";
import useUserdata from "@/components/getuserdata";
import CustomBtn from "@/components/headercutombtn/Custombtn";

const Servicedetails = () => {
  const [loading, setLoading] = useState(true);
  const [itemdetails, setItemdetails] = useState(null);
  const { itemid } = useLocalSearchParams();
  const [arrayimages, setArrayimages] = useState([]);
  const [mainimage, setMainimage] = useState();
  const userdata = useUserdata();
  const [addingtofavorite, setAddingtofavorite] = useState(false);
  const [prevItemId, setPrevItemId] = useState(null);

  const navigation = useNavigation();
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const shouldShowButton =
    userdata?.islogedin && itemdetails?.userId !== userdata?.userId;

  useLayoutEffect(() => {
    if (itemdetails) {
      navigation.setOptions({
        title: itemdetails?.title,
        headerTitleAlign: "center",

        headerTitleStyle: { fontWeight: "bold" },

        tabBarStyle: { display: "none" },
        headerLeft: () => (
          <Pressable onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={35} color="black" />
          </Pressable>
        ),
      });
    }
  }, [navigation, itemdetails]);

  const postinfo = useCallback(async () => {
    // if (prevItemId.current === itemid) return; // Only fetch if itemid has changed
    setLoading(true);
    try {
      const docRef = doc(db, "post", itemid);
      const docsnap = await getDoc(docRef);
      if (docsnap.exists()) {
        const data = docsnap.data();
        setItemdetails(data);
        setMainimage(data.image);
        setArrayimages(data.images || []);
      } else {
        Alert.alert("Error", "No post found");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while fetching the post details.",
      );
    } finally {
      setLoading(false);
      //prevItemId.current = itemid; // Update previous item id
    }
  }, [itemid]); // Only depend on itemid

  useFocusEffect(
    useCallback(() => {
      postinfo(); // Fetch data when the screen gains focus

      return () => {
        // Stop the video playback when the screen loses focus
        if (video.current) {
          video.current.stopAsync(); // Use the appropriate method to stop the video
        }
      };
    }, [postinfo]),
  );

  const handleImagePress = (image) => {
    setMainimage(image);
  };

  const addfavorite = async () => {
    setAddingtofavorite(true);
    try {
      const q = query(
        collection(db, "savedpost"),
        where("myId", "==", userdata?.userId),
        where("postId", "==", itemid),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, "savedpost"), {
          title: itemdetails?.title,
          location: itemdetails?.location,
          image: itemdetails?.image,
          catId: itemdetails?.catId,
          userId: itemdetails?.userId,
          ownername: itemdetails?.ownername,
          myId: userdata?.userId,
          postId: itemid,
          createdAt: new Date(),
          favorite: true,
        });

        await updateDoc(doc(db, "post", itemid), {
          favorite: parseInt(itemdetails?.favorite || 0) + 1,
        });

        Alert.alert("Success", "Post added to your favorites");
      } else {
        Alert.alert("Notice", "You have already liked this post");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to add the post to your favorites.",
      );
    } finally {
      setAddingtofavorite(false);
    }
  };

  return (
    <>
      <CustomBtn text="Post details" link="/hidden/Saved" />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.appcolor.begreen}
            style={styles.loadingIndicator}
          />
        ) : (
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: mainimage }} />
            </View>
            {arrayimages.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {arrayimages.map((image, index) => (
                  <Pressable
                    onPress={() => handleImagePress(image)}
                    key={index}
                  >
                    <Image style={styles.thumbnail} source={{ uri: image }} />
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {itemdetails?.video && (
              <View style={styles.videoContainer}>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{ uri: itemdetails?.video }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  onPlaybackStatusUpdate={(status) => setStatus(status)}
                />
                <Button
                  onPress={() =>
                    status.isPlaying
                      ? video.current.pauseAsync()
                      : video.current.playAsync()
                  }
                  style={styles.buttonupload}
                  text={status.isPlaying ? "Pause" : "Play"}
                />
              </View>
            )}
            <PhoneNumber
              mynumber={itemdetails?.number}
              btncolor={{
                backgroundColor: "black",
                justifyContent: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Posted By {itemdetails?.ownername}
              </Text>
              {/* <Text style={styles.infoText}>Service rendering {itemdetails?.servicetype}</Text> */}
              <Text style={styles.infoText}>{itemdetails?.title}</Text>
              <Text style={styles.infoText}>
                {itemdetails?.location} Region of Ghana
              </Text>
              <Text style={styles.infoText}>{itemdetails?.catId}</Text>
              <Text style={styles.infoText}>
                Likes: {itemdetails?.favorite}
              </Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {itemdetails?.description}
              </Text>
            </View>
            {shouldShowButton && (
              <>
                {!addingtofavorite ? (
                  <Button
                    text="Add to favorite"
                    onPress={addfavorite}
                    mystyle={styles.button}
                  />
                ) : (
                  <Button text="Please wait" mystyle={styles.button} />
                )}
                <Button
                  text={`Chat with ${itemdetails?.ownername}`}
                  mystyle={styles.button}
                  onPress={() =>
                    router.push({
                      pathname: "hidden/Messages",
                      params: {
                        fromid: userdata?.userId,
                        tousername: itemdetails?.ownername,
                        toid: itemdetails?.userId,
                      },
                    })
                  }
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
    height: 200,
    backgroundColor: "#C798A0", // Lightened background color
    borderRadius: 10,
    width: "100%",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 5,
  },
  videoContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  video: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  buttonupload: {
    marginTop: 10,
    backgroundColor: Colors.appcolor.begreen,
  },
  infoContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
    fontFamily: "Poppins-medium",
    fontWeight: "300",
  },
  descriptionContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    fontFamily: "Poppins-medium",
    fontWeight: "300",
  },
  button: {
    marginVertical: 5,
    backgroundColor: Colors.appcolor.begreen,
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    marginTop: 20,
    textAlign: "center",
  },
  toprightview: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    textAlign: "center",
  },
  toptext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});

export default Servicedetails;
