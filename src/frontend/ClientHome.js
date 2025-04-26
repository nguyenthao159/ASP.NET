// src/frontend/ClientHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductServices from '../services/productService';
import categoryService from '../services/categoryService';
import Header from '../components/Header.js';
import Footer from './Footer';
import './ClientHome.css';
import Banner from './Banner.js';

const ClientHome = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryResponse = await categoryService.GetCategories();
        const categoryData = Array.isArray(categoryResponse)
          ? categoryResponse
          : categoryResponse.data || [];
        setCategories(categoryData);

        const productResponse = await ProductServices.getAllProducts();
        const productData = Array.isArray(productResponse)
          ? productResponse
          : productResponse.data || [];
        setProducts(productData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        setError(err.message || 'Không thể tải dữ liệu.');
        setLoading(false);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="client-home">
      <Header />
      <Banner />
      <h1 className="home-title">Chào mừng đến với ThaoWendy – Thế giới đồ cưới tinh tế</h1>
      <div className="category-filter">
        <label htmlFor="category">Chọn danh mục: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            handleCategoryChange(e.target.value);
          }}
        >
          <option value="all">Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      
      <div className="product-grid">
  {products.length > 0 ? (
    products.map((product) => (
      <div
        key={product.id}
        className="product-card"
        onClick={() => handleProductClick(product.id)}
      >
        <div className="product-image-wrapper">
          <img
            src={product.image || 'https://via.placeholder.com/300x350?text=No+Image'}
            alt={product.name}
            className="productimage"

          />
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p className="price">
            {product.price?.toLocaleString('vi-VN')} VNĐ
          </p>
        </div>
      </div>
    ))
  ) : (
    <div>Không tìm thấy sản phẩm nào!</div>
  )}
</div>





      <Footer />
    </div>
  );
};

export default ClientHome;
