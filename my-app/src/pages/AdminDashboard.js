import React, { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

function AdminDashboard() {
  // URL base จากตัวแปรสภาพแวดล้อมในไฟล์ .env
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // สมมติว่าต้องการดึงข้อมูลบางอย่างจาก API เพื่อแสดงในแดชบอร์ด
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard-data`);
        if (!response.ok) {
          throw new Error('Error fetching dashboard data');
        }
        const data = await response.json();
        console.log(data); // สามารถนำข้อมูลนี้ไปใช้งานต่อได้
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">แดชบอร์ด</h1>
        <p>ยินดีต้อนรับสู่แดชบอร์ดผู้ดูแลระบบ</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
