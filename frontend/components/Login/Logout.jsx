import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { logoutUser } from '../services/api';

export const Logout = () => {
  const [loading, setLoading] = useState(true);  // Track the loading state
  const [error, setError] = useState(null);  // Track any errors during logout

  useEffect(() => {
    (async () => {
      try {
        // Get the access token and refresh token from localStorage
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Ensure both tokens exist before proceeding
        if (!accessToken || !refreshToken) {
          console.error('No access or refresh token found');
          setError('No tokens found. Please log in again.');
          setLoading(false);
          return;
        }

        // Call the logout API
        const status = await logoutUser(refreshToken, accessToken);

        if (status === 205) {
          // Clear localStorage and axios headers after successful logout
          localStorage.clear();
          axios.defaults.headers.common['Authorization'] = null;

          // Redirect to login page
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
