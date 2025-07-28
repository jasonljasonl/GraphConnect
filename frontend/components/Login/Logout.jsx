import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { logoutUser } from '../services/api';

export const Logout = () => {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    (async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (!accessToken || !refreshToken) {
          console.error('No access or refresh token found');
          setError('No tokens found. Please log in again.');
          setLoading(false);
          return;
        }

        const status = await logoutUser(refreshToken, accessToken);

        if (status === 205) {
          localStorage.clear();
          axios.defaults.headers.common['Authorization'] = null;

          window.location.href = '/login';
        } else {
          setError('Failed to log out, please try again.');
        }
      } catch (e) {
        console.error('Logout error:', e);
        setError('Logout failed. Please try again.');
      } finally {
        setLoading(false); 
      }
    })();
  }, []); 

  if (loading) {
    return <div>Logging you out...</div>;  
  }

  if (error) {
    return <div>{error}</div>; 
  }

  return <div></div>;  
};
