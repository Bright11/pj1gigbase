import { View, Image, TouchableOpacity, StyleSheet, FlatList, Text } from 'react-native';
import React from 'react';
import useCategoryData from './firebasedata/ServicesCategory';
import { Colors } from '@/constants/Colors';

const AllcategoryIcons = (props) => {
    const categorydata = useCategoryData();
    const { handlepress } = props;

    return (
        <View style={styles.container}>
            <FlatList
                numColumns={3}
                showsVerticalScrollIndicator={false}
                data={categorydata}
                keyExtractor={(item) => item?.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlepress(item.name)} style={styles.categoryItemView}>
                        <Image source={{ uri: item?.image }} style={styles.categoryImage} />
                        <Text numberOfLines={1} style={styles.categoryName}>{item?.name.substring(0, 20)}</Text>
                    </TouchableOpacity>
                )}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 10,
        width: '100%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    categoryItemView: {
        alignItems: 'center',
        width: '30%',
        height:120,
        overflow:"hidden",
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 10,
        borderColor: Colors.appcolor.promarycolor,
        borderWidth: 1,
        backgroundColor: 'white',
    },
    categoryImage: {
        width: 80, // Fixed width for all images
        height: 80, // Fixed height for all images
        resizeMode: 'cover', // Ensures the image fills the container while maintaining aspect ratio
        borderRadius: 10,
        marginBottom: 5,
    },
    categoryName: {
        fontFamily: "Poppins-MediumItalic",
        textAlign: 'center',
        fontSize: 12,
    },
});

export default AllcategoryIcons;
