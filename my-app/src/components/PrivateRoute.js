import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // เพิ่ม delay เล็กน้อยเพื่อรอให้ useEffect ใน AuthContext ดึงข้อมูลจาก localStorage
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  if (!isLoaded) {
    return null; // ระหว่างโหลดแสดงว่าไม่แสดงอะไร
  }

  // ถ้าผู้ใช้ไม่ได้ล็อกอินให้พาไปหน้า Login
  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
