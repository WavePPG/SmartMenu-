// src/components/AdminSidebar.js

import React from 'react';
import { Link } from 'react-router-dom';

function AdminSidebar() {
  return (
    <div className="min-h-screen w-60 bg-white shadow-md p-4 fixed">
      <h2 className="text-xl font-bold mb-6">เมนูผู้ดูแลระบบ</h2>
      <nav>
        <ul>
          <li className="mb-4">
            <Link to="/admin" className="text-gray-800 hover:text-blue-500">แดชบอร์ด</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/items" className="text-gray-800 hover:text-blue-500">จัดการสินค้า</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/categories" className="text-gray-800 hover:text-blue-500">จัดการหมวดหมู่</Link>
          </li>
          <li className="mb-4">
            <Link to="/admin/tables" className="text-gray-800 hover:text-blue-500">จัดการโต๊ะ</Link>
          </li>

          <li className="mt-10">
            <Link to="/login" className="text-red-500 hover:text-red-700">ออกจากระบบ</Link>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default AdminSidebar;
