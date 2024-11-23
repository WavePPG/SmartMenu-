import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      alert('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl mb-4">เข้าสู่ระบบสำหรับผู้ดูแลระบบ</h2>
        <input
          name="username"
          placeholder="ชื่อผู้ใช้"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="รหัสผ่าน"
          onChange={handleChange}
          className="border p-2 mb-4 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
