import { StyleSheet, Text, View, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import PhoneNumber from './Number/PhoneNumber';
import { router } from 'expo-router';

const Searchdata = ({ searchdata, handleLoadMore, loadingMore, loading }) => {
    return (
        <View>
            <FlatList
                data={searchdata}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.usersadditems}
                        onPress={() =>
                            router.push({
                                pathname: '/(tabs)/Servicedetails',
                                params: { itemid: item.id },
                            })
                        }
                    >
                        <View style={styles.servicesimageview}>
                            {item.image ? (
                                <>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.servicesimage}
                                    />
                                    {loading && (
                                        <ActivityIndicator
                                            size="small"
                                            color={Colors.appcolor.begreen}
                                            style={styles.loadingIndicator}
                                        />
                                    )}
                                </>
                            ) : (
                                <Text style={styles.errorText}>Image not available</Text>
                            )}
                        </View>
                        <View style={styles.services_textview}>
                            <Text>View Service</Text>
                            <Text>Contact for price</Text>
                            <Text style={styles.pricetext}>{item.location}</Text>
                            <Text>{item.title}</Text>
                            <PhoneNumber mynumber={item.number} btncolor={{ backgroundColor: Colors.appcolor.begreen }} />
                        </View>
                    </Pressable>
                )}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color={Colors.appcolor.begreen} /> : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    usersadditems: {
        flex: 1,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 10,
        shadowColor: "#000",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-between',
    },
    servicesimageview: {
        width: "40%",
        maxHeight: 150,
        height: 150,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    servicesimage: {
        width: "100%",
        height: "100%",
        objectFit: 'cover',
        resizeMode: 'contain',
    },
    loadingIndicator: {
        position: 'absolute',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    services_textview: {
        width: "60%",
    },
    pricetext: {
        color: Colors.appcolor.begreen,
    },
});

export default Searchdata;
