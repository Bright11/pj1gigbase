import AsyncStorage from '@react-native-async-storage/async-storage';

export const localstorage = async () => {
    try {
        const keys = [
          "islogedin",
          "username",
          "userId",
          "pnumber",
          "email",
          "servicetype",
          "userprofile"
        ];
        const results = await AsyncStorage.multiGet(keys);
    
        const userData = {};
        results.forEach(([key, value]) => {
          // Only parse JSON if the value is a JSON string
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            userData[key] = JSON.parse(value);
          } else {
            userData[key] = value; // Store the value as-is
          }
        });
    
        return userData;
      } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
      }
    };
//  
