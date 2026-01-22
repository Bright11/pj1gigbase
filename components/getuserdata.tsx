import { useState, useEffect } from 'react';
import { localstorage } from './localstorage';

// Custom Hook to fetch and store user data
function useUserdata() {
  const [userdata, setUserdata] = useState(null);
   const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUserdata = async () => {
      const data = await localstorage();
      setUserdata(data);
    };
    fetchUserdata();
  }, []);

  return userdata;
}

export default useUserdata;
