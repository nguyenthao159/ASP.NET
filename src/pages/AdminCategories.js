import React, { useState, useEffect } from "react";
import categoryService from "../services/categoryService";
import "./AdminCategories.css";

function AdminCategories() {
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const data = await categoryService.GetCategories();
      setCategory(data);
    } catch (err) {
      setError("Không thể tải danh mục");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
      };

      if (isEditing) {
        await categoryService.update(formData.id, { ...payload, id: formData.id });
      } else {
        await categoryService.insert(payload);
      }

      resetForm();
      fetchCategory();
      setShowForm(false);
    } catch (err) {
      setError("Lỗi khi lưu danh mục");
    }
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
      try {
        await categoryService.destroy(id);
        fetchCategory();
      } catch (err) {
        setError("Lỗi khi xóa danh mục");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      description: '',
      image: null
    });
    setIsEditing(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (!showForm) resetForm(); // Reset form khi hiện
  };

  return (
    <div className="admin-categories">
      <h2>Quản lý danh mục</h2>

      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? "Ẩn Form" : "Thêm danh mục"}
      </button>

      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? "Sửa danh mục" : "Thêm danh mục"}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên danh mục:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Mô tả:</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Ảnh:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </div>
            <div className="form-actions">
              <button type="submit">{isEditing ? "Cập nhật" : "Thêm"}</button>
              <button type="button" onClick={toggleForm}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h3>Danh sách danh mục</h3>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Ảnh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {category &&
              category.length > 0 &&
              category.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} width="50" />
                  ) : (
                    "Không có ảnh"
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="edit-button">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="delete-button">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {category.length === 0 && (
              <tr>
                <td colSpan="5">Không có danh mục nào</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;
