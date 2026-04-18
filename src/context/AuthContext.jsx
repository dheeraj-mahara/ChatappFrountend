// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            withCredentials: true,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });

        setCurrentUser(res.data.user);
      } catch (err) {
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);