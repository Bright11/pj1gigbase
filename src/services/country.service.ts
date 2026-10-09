// import axios from 'axios';

// interface IPGeolocationResponse {
//   status: string;
//   countryCode?: string;
// }

// export const getUserCountryCode = async (): Promise<string | null> => {
//   try {
//     const response = await axios.get<IPGeolocationResponse>(
//       'https://ipinfo.io/json',
//       {
//         timeout: 5000,
//       },
//     );

//     if (
//       response.data?.countryCode &&
//       response.data.countryCode.length === 2
//     ) {
//       return response.data.countryCode.toUpperCase();
//     }

//     return null;
//   } catch (error) {
//     console.log('Could not detect user country:', error);
//     return null;
//   }
// };


import axios from 'axios';

interface IPGeolocationResponse {
  country_code?: string;
}

export const getUserCountryCode = async (): Promise<string | null> => {
  try {
    const response = await axios.get<IPGeolocationResponse>(
      'https://ipwho.is/',
      {
        timeout: 5000,
      },
    );

    const countryCode = response.data?.country_code;

    console.log('Detected country code:', countryCode);

    if (countryCode && countryCode.length === 2) {
      return countryCode.toUpperCase();
    }

    return null;
  } catch (error) {
    console.log('Could not detect user country:', error);
    return null;
  }
};


