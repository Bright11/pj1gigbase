
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { api } from '@/services/api';
import Constants from 'expo-constants'
import { router } from 'expo-router';


// npx expo install expo-notifications expo-device



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log(
      'Push notifications require a physical device.',
    );

    return null;
  }

if (Device.osName === 'Android') {
  await Notifications.setNotificationChannelAsync(
    'default',
    {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: 'default',
    }
  );
}

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log(
      'Notification permission was not granted.',
    );

    return null;
  }

//   const tokenResponse =
//     await Notifications.getExpoPushTokenAsync();

const projectId =
  Constants.expoConfig?.extra?.eas?.projectId;
if(!projectId){
  throw new Error(
    "Expo project ID is not configured."
  )
}

const tokenResponse =
  await Notifications.getExpoPushTokenAsync({
    projectId
  });

  const expoPushToken =
    tokenResponse.data;

  console.log(
    'Expo Push Token:',
    expoPushToken,
  );

  return expoPushToken;
};



// export const setupNotificationListeners = async () => {
//   const navigateFromNotification = (
//     response: Notifications.NotificationResponse,
//   ) => {
//     const data =
//       response.notification.request.content.data;

//     console.log(
//       '========== NOTIFICATION TAPPED =========='
//     );

//     console.log(
//       'NOTIFICATION DATA:',
//       JSON.stringify(data, null, 2)
//     );

//     console.log(
//       '=========================================='
//     );

//     if (data?.screen === 'booking') {

//       if (data?.action === 'booking_request') {
//         console.log(
//           'NAVIGATING TO BOOKING REQUESTS'
//         );

//         router.push('/booking/bookingrequest');
//         return;
//       }

//       if (data?.action === 'my_bookings') {
//         console.log(
//           'NAVIGATING TO MY BOOKINGS'
//         );

//         router.push('/booking/my-bookings');
//         return;
//       }
//     }

//     if (
//       data?.screen === 'chat' &&
//       data?.action === 'conversation' &&
//       data?.conversation_id
//     ) {
//       console.log(
//         'NAVIGATING TO CHAT:',
//         data.conversation_id
//       );

//       router.push(
//         `/chat/${data.conversation_id}`
//       );

//       return;
//     }
//   };

//   // Handle notification taps while app is running/background
//   const responseSubscription =
//     Notifications.addNotificationResponseReceivedListener(
//       navigateFromNotification
//     );

//   // Handle notification that launched the app
//   const lastResponse =
//     await Notifications.getLastNotificationResponseAsync();

//   if (lastResponse) {
//     console.log(
//       'FOUND LAST NOTIFICATION RESPONSE'
//     );

//     navigateFromNotification(lastResponse);
//   }

//   // Notification received while app is open
//   const receivedSubscription =
//     Notifications.addNotificationReceivedListener(
//       notification => {
//         console.log(
//           'NOTIFICATION RECEIVED:',
//           notification
//         );
//       }
//     );

//   return () => {
//     receivedSubscription.remove();
//     responseSubscription.remove();
//   };
// };

export const setupNotificationListeners = () => {
  const handleNotificationResponse = (
    response: Notifications.NotificationResponse,
  ) => {
    const data =
      response.notification.request.content.data;

    console.log(
      '========== NOTIFICATION TAPPED =========='
    );

    console.log(
      'NOTIFICATION DATA:',
      JSON.stringify(data, null, 2)
    );

    console.log(
      '=========================================='
    );

    if (data?.screen === 'booking') {
      if (data?.action === 'booking_request') {
        console.log(
          'NAVIGATING TO BOOKING REQUESTS'
        );

        router.push('/booking/bookingrequest');
        return;
      }

      if (data?.action === 'my_bookings') {
        console.log(
          'NAVIGATING TO MY BOOKINGS'
        );

        router.push('/booking/my-bookings');
        return;
      }
    }

    if (
      data?.screen === 'chat' &&
      data?.action === 'conversation' &&
      data?.conversation_id
    ) {
      console.log(
        'NAVIGATING TO CHAT:',
        data.conversation_id
      );

      router.push(
        `/chat/${data.conversation_id}`
      );

      return;
    }
  };

  // Notification received while the app is running
  const receivedSubscription =
    Notifications.addNotificationReceivedListener(
      notification => {
        console.log(
          'NOTIFICATION RECEIVED:',
          notification
        );
      }
    );

  // Notification tapped while the app is running
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

  // Check whether a notification launched the app
  Notifications.getLastNotificationResponseAsync()
    .then(response => {
      if (response) {
        console.log(
          'FOUND LAST NOTIFICATION RESPONSE'
        );

        handleNotificationResponse(response);
      }
    })
    .catch(error => {
      console.log(
        'Unable to get last notification response:',
        error
      );
    });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};

export const savePushToken = async (
  expoPushToken: string,
) => {
  console.log("CALLING NOTIFICATION TOKEN API")
  const response = await api.post(
    '/api/auth/notification-token/',
    {
      expo_push_token: expoPushToken,
    },
  );
  console.log("Notification API response", response.data)

  return response.data;
};


export const registerAndSavePushToken =
  async () => {
    try {
      const token =
        await registerForPushNotifications();

      if (!token) {
        return null;
      }
      console.log('TOKEN RECEIVED, SAVING TO BACKEND');

      await savePushToken(token);
        console.log('TOKEN SAVED TO BACKEND');

      return token;
    } catch (error: any) {
      console.log(
        'Unable to register push notification token:',
        error?.response?.data || error,
      );

      return null;
    }
  };


