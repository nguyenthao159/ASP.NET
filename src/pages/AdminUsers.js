import React, { useState, useEffect } from 'react';
import UserService from '../services/userService';
import './AdminUsers.css';

function AdminUsers() {
  const [user, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'User',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải người dùng');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await UserService.update(formData.id, formData);
      } else {
        await UserService.register(formData);
      }
      resetForm();
      fetchUsers();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data || 'Lỗi xử lý người dùng');
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      password: '', // không sửa password
      phone: user.phone,
      address: user.address,
      role: user.role,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await UserService.remove(id);
        fetchUsers();
      } catch (err) {
        setError('Lỗi khi xóa người dùng');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'User',
    });
    setIsEditing(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) resetForm();
  };

  return (
    <div className="admin-users">
      <h2>Quản lý người dùng</h2>
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ẩn Form' : 'Thêm người dùng'}
      </button>

      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? 'Sửa người dùng' : 'Thêm người dùng'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Họ tên:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Số điện thoại:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Địa chỉ:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Vai trò:</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {!isEditing && (
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
            )}
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
              <button type="button" onClick={toggleForm}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h3>Danh sách người dùng</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)} className="edit-button">Sửa</button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
