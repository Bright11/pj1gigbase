import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/components/firebase/Firebaseconfig";
import { router, useNavigation } from "expo-router";

const Advertcategory = ({ setCategoryName, setOpencategory }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  // Setup navigation options in useEffect
  useEffect(() => {
    navigation.setOptions({
      title: "Service Category",
      headerTitleAlign: "center",
      headerTitleStyle: { fontWeight: "bold" },
      headerLeft: () => (
        <TouchableOpacity onPress={() => setOpencategory(false)}>
          <AntDesign name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchData = async () => {
    try {
      const categoryRef = collection(db, "categories");
      const q = query(categoryRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSelectedItems(items);
    } catch (error) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCategory = (categoryName) => {
    setCategoryName(categoryName); // Pass the selected category back to Editpost
    setOpencategory(false); // Close the category selection view
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loading}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      {selectedItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.categoryItem}
          onPress={() => handleSelectCategory(item.name)}
        >
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Advertcategory;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
