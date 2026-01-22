import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import SearchBar from '@/components/homecomponets/SearchBar';
import TopCategory from '@/components/homecomponets/TopCategory';
import AllcategoryIcons from '@/components/homecomponets/AllcategoryIcons';
import { router, useNavigation } from 'expo-router';
import useUserdata from '@/components/getuserdata';
import Searchdata from '@/components/homecomponets/Searchdata';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/components/firebase/Firebaseconfig';
import { debounce } from 'lodash';

const Home = () => {
  const navigation = useNavigation();
  const userdata = useUserdata();

  const [searchState, setSearchState] = useState({
    text: '',
    loading: false,
    data: [],
    isActive: false,
  });

  const [getitembyId, setGetitemId] = useState("");

  const searchInputRef = useRef(null);

  // Debounced search function
  const handleSearch = debounce(async (searchText) => {
    if (searchText === "") {
      setSearchState((prev) => ({
        ...prev,
        data: [],
        isActive: false,
      }));
      return;
    }

    try {
      setSearchState((prev) => ({ ...prev, loading: true }));

      // Get all posts where `catId` or `title` are relevant.
      const q1 = query(collection(db, "post"));
      const querySnapshot1 = await getDocs(q1);

      const searchResults = [];
      querySnapshot1.forEach((doc) => {
        const docData = { id: doc.id, ...doc.data() };

        // Perform partial matching on the client-side
        if (
          docData.catId.includes(searchText) ||
          docData.title.includes(searchText)
        ) {
          searchResults.push(docData);
        }
      });

      setSearchState((prev) => ({
        ...prev,
        data: searchResults,
        isActive: true,
      }));
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setSearchState((prev) => ({ ...prev, loading: false }));
    }
  }, 300); // Debounce delay


  useLayoutEffect(() => {
    navigation.setOptions({
      title: "PJ1 GIGBASE",
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: "Poppins-MediumItalic"
      },
      headerRight: () => (
        <View>
          {userdata?.userId ? "" : (
            <TouchableOpacity style={style.loginbtn} onPress={() => router.replace("/(auth)/login")}>
              <Text style={{ fontWeight: 'bold', color: 'blue', fontFamily: "Poppins-MediumItalic", fontSize: 16, color: "black" }}>Log in</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    });
  }, [navigation, userdata]);

  useEffect(() => {
    handleSearch(searchState.text);
  }, [searchState.text]);

  const handleTouchOutside = () => {
    Keyboard.dismiss();
    setSearchState((prev) => ({ ...prev, text: '' }));
  };

  const handlepress = (categoryname) => {
  
    setSearchState((prev) => ({
      ...prev,
      text: categoryname,
    }));
  };

  useEffect(() => {
 
  }, [searchState]);

  return (
    <TouchableWithoutFeedback onPress={handleTouchOutside}>
      <SafeAreaView style={{ marginTop: 0, paddingTop: 0, flex: 1 }}>
      <StatusBar translucent backgroundColor="#5E8D48" barStyle="light-content" />

        <SearchBar
          searchtext={searchState.text}
          setSearchtext={(text) => setSearchState((prev) => ({ ...prev, text }))}
          onSearch={handleSearch}
          ref={searchInputRef}
        />
 {searchState.isActive && searchState.text ?(""):(
  <View>
  <TopCategory getitembyId={getitembyId} setGetitemId={setGetitemId} handlepress={handlepress} />
</View>
 )}
        

        <View style={{ flex: 1 }}>
          {searchState.isActive && searchState.text ? (
            searchState.data.length > 0 ? (
              <Searchdata
                searchtext={searchState.text}
                setSearchtext={(text) => setSearchState((prev) => ({ ...prev, text }))}
                loading={searchState.loading}
                searchdata={searchState.data}
              />
            ) : (
              <View style={style.noResultsContainer}>
                <Text style={style.noResultsText}>No results found for "{searchState.text}"</Text>
              </View>
            )
          ) : (
            <AllcategoryIcons getitembyId={getitembyId} setGetitemId={setGetitemId} handlepress={handlepress} />
          )}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default Home;

const style = StyleSheet.create({
  loginbtn: {
    marginRight: 10,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Poppins-MediumItalic',
  },
});
