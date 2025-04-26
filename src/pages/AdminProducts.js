import React, { useState, useEffect } from "react";
import productService from "../services/productService";
import "./AdminProducts.css";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const BASE_URL = "http://localhost:7148"; // đảm bảo đây là path ảnh chính xác
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    description: "",
    image: null,
    categoryId: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.title ||
        err.response?.data ||
        err.message ||
        "Không thể tải sản phẩm";
      setError(errorMessage);
      setProducts([]);
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("Name", formData.name);
      data.append("Price", formData.price);
      data.append("Description", formData.description);
      data.append("CategoryId", formData.categoryId);
      if (formData.image) {
        data.append("Image", formData.image);
      }

      if (isEditing) {
        data.append("Id", formData.id);
        await productService.update(formData.id, data);
      } else {
        await productService.insert(data);
      }
      resetForm();
      fetchProducts();
      setShowForm(false);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.title ||
        err.response?.data ||
        err.message ||
        "Lỗi khi lưu sản phẩm";
      setError(errorMessage);
      console.error("Lỗi khi lưu sản phẩm:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: null,
      categoryId: product.categoryId,
    });
    setImagePreview(`${BASE_URL}/${product.image}`);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await productService.destroy(id);
        fetchProducts();
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.title ||
          err.response?.data ||
          err.message ||
          "Lỗi khi xóa sản phẩm";
        setError(errorMessage);
        console.error("Lỗi khi xóa sản phẩm:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      price: "",
      description: "",
      image: null,
      categoryId: "",
    });
    setImagePreview("");
    setIsEditing(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  return (
    <div className="admin-products">
      <h2>Quản lý sản phẩm</h2>

      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? "Ẩn Form" : "Thêm sản phẩm"}
      </button>

      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div>
              <label>Tên sản phẩm:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Giá:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div>
              <label>Mô tả:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Hình ảnh:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required={!isEditing}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                  onError={(e) => {
                    e.target.src = "/fallback.jpg";
                    console.error(`Không load được preview: ${imagePreview}`);
                  }}
                />
              )}
            </div>
            <div>
              <label>ID danh mục:</label>
              <input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">{isEditing ? "Cập nhật" : "Thêm"}</button>
              <button type="button" onClick={toggleForm}>
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h3>Danh sách sản phẩm</h3>
        {error && <p className="error">{error}</p>}
        {products.length === 0 ? (
          <p>Không có sản phẩm nào để hiển thị.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Mô tả</th>
                <th>Hình ảnh</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td>
                      <img
                        src={product.image} 
                        alt={product.name}
                        className="product-image"
                        
                      />
                    </td>

                    <td>
                      <button
                        onClick={() => handleEdit(product)}
                        className="edit-button"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="delete-button"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminProducts;
