
What each part does

app/(auth)
Only Expo Router screens/navigation.

 npx tsc --noEmit     
npx expo run:android   

npx expo start --clear    
npx expo prebuild --clean --platform android    
npx eas-cli build --platform android --profile production                             

TypeScript interfaces for users, login responses, registration data, etc.

<!-- How to check if there are any typscrip errors -->
npx tsc --noEmit


