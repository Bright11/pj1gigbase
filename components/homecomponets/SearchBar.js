import React, { forwardRef } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Image, ImageBackground } from 'react-native';
import { searchstyle } from './searchstyle';
import useUserdata from '../getuserdata';

const SearchBar = forwardRef(({ searchtext, setSearchtext, onSearch }, ref) => {
    const userdata = useUserdata();

    // Function to handle input change and search
    const handleInputChange = (text) => {
       // console.log("Text Input:", text); // For debugging
        setSearchtext(text); // Update search text
        onSearch(text);      // Trigger search
    };

    return (
        //  <View style={searchstyle.searchsection}>
        <ImageBackground
        source={require("../../assets/images/pj1gif.gif")}
        style={searchstyle.searchsection}
         resizeMode="cover"
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <View style={searchstyle.searchcontainerview}>
                    <View style={searchstyle.logo_container}>
                        <Image source={require("./../../assets/images/pjlogo.jpeg")} style={searchstyle.logoimage} />
                        <Text style={searchstyle.searchtext}>What are you looking for?</Text>
                    </View>
                    <Pressable style={searchstyle.searchinputfomr}>
                        <TextInput
                            ref={ref} // Assign ref to the TextInput
                            style={searchstyle.searchTextinput}
                            value={searchtext}
                            onChangeText={handleInputChange} // Update search text and trigger search
                            placeholder="Search..."
                            placeholderTextColor="white"
                        />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
});

export default SearchBar;
