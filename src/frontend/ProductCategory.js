// src/frontend/ProductCategory.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductServices from '../services/productService';
import Header from '../components/Header';
import './ProductCategory.css';

const ProductCategory = () => {
  const { id } = useParams(); // Lấy categoryId từ URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        const allProducts = await ProductServices.getAllProducts();
        // Lọc sản phẩm theo CategoryId từ danh sách
        const filtered = allProducts.filter(p => p.categoryId === parseInt(id));
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
        setError('Không thể tải sản phẩm.');
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-category">
      <Header />
      <Link to="/" className="back-link">Quay lại trang chủ</Link>
      <h1>Sản phẩm trong danh mục</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => window.location.href = `/product/${product.id}`}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="productimage"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">
                {product.price?.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          ))
        ) : (
          <div>Không tìm thấy sản phẩm nào trong danh mục này!</div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;
