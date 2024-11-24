import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  // Base URL จาก environment variables
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // ใช้ useCallback เพื่อให้แน่ใจว่า fetchCategories ไม่เปลี่ยนแปลงทุกครั้งที่ component render
  const fetchCategories = useCallback(() => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      return;
    }

    axios
      .get(`${API_BASE_URL}/admin/categories`, { withCredentials: true })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่:', error);
      });
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      return;
    }
    if (!newCategory.trim()) {
      alert('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    axios
      .post(`${API_BASE_URL}/admin/categories`, { name: newCategory }, { withCredentials: true })
      .then(() => {
        alert('เพิ่มหมวดหมู่ใหม่สำเร็จ');
        setNewCategory('');
        setIsAdding(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่:', error);
        if (error.response) {
          alert(`เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่: ${error.response.data}`);
        } else {
          alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่');
        }
      });
  };

  const handleDeleteCategory = (categoryId) => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      return;
    }

    if (window.confirm('คุณต้องการลบหมวดหมู่นี้หรือไม่?')) {
      axios
        .delete(`${API_BASE_URL}/admin/categories/${categoryId}`, { withCredentials: true })
        .then(() => {
          alert('ลบหมวดหมู่เรียบร้อยแล้ว');
          fetchCategories();
        })
        .catch((error) => {
          console.error('เกิดข้อผิดพลาดในการลบหมวดหมู่:', error);
          if (error.response) {
            alert(`เกิดข้อผิดพลาดในการลบหมวดหมู่: ${error.response.data}`);
          } else {
            alert('เกิดข้อผิดพลาดในการลบหมวดหมู่');
          }
        });
    }
  };

  const handleEditCategory = (categoryId) => {
    if (!API_BASE_URL) {
      console.error('API_BASE_URL is not defined');
      return;
    }
    if (!editCategoryName.trim()) {
      alert('กรุณากรอกชื่อหมวดหมู่ใหม่');
      return;
    }

    axios
      .put(`${API_BASE_URL}/admin/categories/${categoryId}`, { name: editCategoryName }, { withCredentials: true })
      .then(() => {
        alert('แก้ไขหมวดหมู่เรียบร้อยแล้ว');
        setIsEditing(null);
        setEditCategoryName('');
        fetchCategories();
      })
      .catch((error) => {
        console.error('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่:', error);
        if (error.response) {
          alert(`เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่: ${error.response.data}`);
        } else {
          alert('เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่');
        }
      });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="ml-64 p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">จัดการหมวดหมู่</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          เพิ่มหมวดหมู่ใหม่
        </button>

        {isAdding && (
          <div className="mb-4">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="ชื่อหมวดหมู่"
              className="border p-2 mr-2"
            />
            <button
              onClick={handleAddCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              บันทึก
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              ยกเลิก
            </button>
          </div>
        )}

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
                <td className="border px-4 py-2">
                  {isEditing === category.category_id ? (
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="border p-2"
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td className="border px-4 py-2">
                  {isEditing === category.category_id ? (
                    <>
                      <button
                        onClick={() => handleEditCategory(category.category_id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        บันทึก
                      </button>
                      <button
                        onClick={() => setIsEditing(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        ยกเลิก
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(category.category_id);
                          setEditCategoryName(category.name);
                        }}
                        className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.category_id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        ลบ
                      </button>
                    </>
                  )}
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
