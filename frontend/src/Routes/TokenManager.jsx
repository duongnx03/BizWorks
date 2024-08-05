import React, { useEffect, useState } from 'react';
import axios from 'axios';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour in milliseconds

const TokenManager = ({ children }) => {
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);

  // Refresh token
  const refreshToken = async () => {
    setIsTokenRefreshing(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/refresh', {}, {
        withCredentials: true // Include cookies in the request if needed
      });
      if (response.status === 200) {
        console.log('Token refreshed successfully');
      } else {
        console.error('Failed to refresh token');
        // Handle refresh token failure (e.g., logout user)
        // Optionally, redirect to login or show error message
      }
    } catch (error) {
      console.error('Error refreshing token', error);
    } finally {
      setIsTokenRefreshing(false);
    }
  };

  useEffect(() => {
    // Call refreshToken when component mounts
    refreshToken();

    // Set interval to refresh token periodically
    const intervalId = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <React.Fragment>
      {isTokenRefreshing ? (
        <div>Refreshing token...</div> // Or some other loading indicator
      ) : (
        children
      )}
    </React.Fragment>
  );
};

export default TokenManager;
