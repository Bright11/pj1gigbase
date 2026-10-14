
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

~~~bash
(Get-Content app.json) -replace '"versionCode": 13', '"versionCode": 14' | Set-Content app.json
(Get-Content android\app\build.gradle) -replace 'versionCode 13', 'versionCode 14' | Set-Content android\app\build.gradle

Select-String -Path app.json -Pattern 'versionCode'
Select-String -Path android\app\build.gradle -Pattern 'versionCode'
~~~
