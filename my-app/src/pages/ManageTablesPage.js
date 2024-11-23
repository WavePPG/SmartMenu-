import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar'; // นำเข้า Sidebar ที่สร้างไว้

function ManageTablesPage() {
  const [tables, setTables] = useState([]);

  // Base URL จาก environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/tables`, { withCredentials: true })
      .then(response => {
        setTables(response.data);
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลโต๊ะ:', error);
      });
  }, [API_BASE_URL]);

  return (
    <div className="flex">
      <AdminSidebar /> {/* ใส่ Sidebar ที่ด้านซ้าย */}
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">จัดการโต๊ะและคิวอาร์โค้ด</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">เพิ่มโต๊ะใหม่</button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4">หมายเลขโต๊ะ</th>
              <th className="py-2 px-4">คิวอาร์โค้ด</th>
              <th className="py-2 px-4">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.table_id}>
                <td className="border px-4 py-2">{table.table_number}</td>
                <td className="border px-4 py-2">
                  <img src={table.qr_code} alt={`QR Code for table ${table.table_number}`} width="100" />
                </td>
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

export default ManageTablesPage;
