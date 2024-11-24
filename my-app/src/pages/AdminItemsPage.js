// AdminItemsPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    availability: 'true', // เปลี่ยนเป็น string เพื่อสะดวกในการจัดการกับ <select>
  });
  const [imageFile, setImageFile] = useState(null);
  const [editItemId, setEditItemId] = useState(null);

  // Base URL จาก environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch items from backend
  const fetchItems = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/admin/items`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => console.error('Error fetching items:', err));
  }, [API_BASE_URL]);

  // Fetch categories from backend
  const fetchCategories = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/admin/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Add or Edit Item
  const handleSubmit = (e) => {
    e.preventDefault();

    // แปลงประเภทข้อมูลก่อนส่ง
    const updatedFormData = {
      ...formData,
      availability: formData.availability === 'true', // แปลงเป็น boolean
      category_id: parseInt(formData.category_id, 10), // แปลงเป็น integer
      price: parseFloat(formData.price), // แปลงเป็น float
    };

    const url = editItemId
      ? `${API_BASE_URL}/admin/items/edit/${editItemId}`
      : `${API_BASE_URL}/admin/items/add`;
    const method = editItemId ? 'PUT' : 'POST';

    const formDataToSend = new FormData();
    formDataToSend.append('name', updatedFormData.name);
    formDataToSend.append('description', updatedFormData.description);
    formDataToSend.append('price', updatedFormData.price);
    formDataToSend.append('category_id', updatedFormData.category_id);
    formDataToSend.append('availability', updatedFormData.availability);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    axios({
      method,
      url,
      data: formDataToSend,
      withCredentials: true,
    })
      .then(() => {
        alert('บันทึกข้อมูลสำเร็จ');
        fetchItems();
        setFormData({
          name: '',
          description: '',
          price: '',
          category_id: '',
          availability: 'true', // รีเซ็ตเป็น 'true' string
        });
        setImageFile(null);
        setEditItemId(null);
      })
      .catch((err) => {
        console.error('Error:', err);
        alert(`Error: ${err.response?.data?.error || err.message}`);
      });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">จัดการสินค้า</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            name="name"
            placeholder="ชื่อสินค้า"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="รายละเอียด"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            name="price"
            placeholder="ราคา"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 mr-2"
            required
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="border p-2 mr-2"
            required
          >
            <option value="">เลือกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="border p-2 mr-2"
          />
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            className="border p-2 mr-2"
          >
            <option value="true">พร้อมจำหน่าย</option>
            <option value="false">ไม่พร้อมจำหน่าย</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            {editItemId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}
          </button>
        </form>

        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">ชื่อสินค้า</th>
              <th className="border p-2">รายละเอียด</th>
              <th className="border p-2">ราคา</th>
              <th className="border p-2">หมวดหมู่</th>
              <th className="border p-2">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.item_id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2">{item.price}</td>
                <td className="border p-2">
                  {categories.find((c) => c.category_id === item.category_id)?.name || 'ไม่ทราบ'}
                </td>
                <td className="border p-2">
                  {item.availability ? 'พร้อมจำหน่าย' : 'ไม่พร้อมจำหน่าย'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminItemsPage;
