import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserService from '../services/userService';
import './Login.css';
import logo from '../Logo_-removebg-preview.png'; // Giả sử bạn có logo đặt trong src/assets/logo.png

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = await UserService.login(formData);
      const user = await UserService.getCurrentUser();

      if (user.role !== 'Admin') {
        setError('Chỉ Admin được phép đăng nhập');
        return;
      }

      authLogin(token, user);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Lỗi đăng nhập:', err.response?.data);

      const extractErrorMessage = (err) => {
        const data = err.response?.data;
        if (data?.errors) {
          return Object.values(data.errors).flat().join(' | ');
        }
        return data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      };

      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>Đăng nhập </h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
