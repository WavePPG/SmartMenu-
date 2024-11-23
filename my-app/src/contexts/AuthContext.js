import React, { createContext, useState, useEffect } from 'react';

// สร้าง Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // ตรวจสอบ localStorage เมื่อแอปโหลดครั้งแรก
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // ฟังก์ชัน Login
  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include', // เพื่อส่ง cookies ที่มี session ไปยัง server
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const user = await response.json();
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ฟังก์ชัน Logout
  const logout = () => {
    fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // เพื่อให้ลบ session cookies ที่ฝั่ง server
    })
      .then(() => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      })
      .catch((err) => console.error('Logout error:', err));
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
