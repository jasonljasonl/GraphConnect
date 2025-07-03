import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

const checkAuth = async () => {
  const token = localStorage.getItem("access_token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const response = await axios.get("http://localhost:8080/api/connected-user/");
      setCurrentUser(response.data);
    } catch (error) {
      console.error("Token invalide :", error);
      logout();
    }
  }
  setLoading(false);
};


  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem("access_token", userData.token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuth: !!currentUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
