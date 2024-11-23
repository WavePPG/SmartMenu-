import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar'; // นำเข้า Sidebar ที่สร้างไว้

function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);

  // Base URL จาก environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/categories`, { withCredentials: true })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
      });
  }, [API_BASE_URL]);

  return (
    <div className="flex">
      <AdminSidebar /> {/* ใส่ Sidebar ที่ด้านซ้าย */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">จัดการหมวดหมู่</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">เพิ่มหมวดหมู่ใหม่</button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4">ชื่อหมวดหมู่</th>
              <th className="py-2 px-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.category_id}>
                <td className="border px-4 py-2">{category.name}</td>
                <td className="border px-4 py-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">แก้ไข</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCategoriesPage;
