import React, { useEffect, useState } from 'react';  // Import useEffect and useState from React
import axios from 'axios';

export const Logout = () => {
  const [loading, setLoading] = useState(true);  // Track the loading state
  const [error, setError] = useState(null);  // Track any errors during logout

  useEffect(() => {
    (async () => {
      try {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Make sure the token exists before sending the request
        if (!accessToken || !refreshToken) {
          console.error('No access or refresh token found');
          setError('No tokens found. Please log in again.');
          setLoading(false);
          return;
        }

        // Send POST request to logout
        const response = await axios.post(
          'http://127.0.0.1:8000/account/logout/',
          { refresh_token: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true, // Ensure credentials are sent
          }
        );

        if (response.status === 205) {
          // Clear localStorage and axios headers after successful logout
          localStorage.clear();
          axios.defaults.headers.common['Authorization'] = null;

          // Redirect after logout
          window.location.href = '/login';
        } else {
          setError('Failed to log out, please try again.');
        }
      } catch (e) {
        console.error('Logout error:', e);
        setError('Logout failed. Please try again.');
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    })();
  }, []);  // Empty dependency array ensures this effect runs once on mount

  if (loading) {
    return <div>Logging you out...</div>;  // Optional loading message
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if something goes wrong
  }

  return <div></div>;  // Empty div since there's no UI to show directly
};
