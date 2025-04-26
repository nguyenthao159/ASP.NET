import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import OrderService from '../services/orderService';
import Header from '../components/Header.js';
import './Cart.css';
import Footer from './Footer'; // Import Footer

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } =
    useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Hàm xử lý thanh toán
  const handleCheckout = async () => {
    // Kiểm tra nếu người dùng chưa đăng nhập
    // if (!isAuthenticated) {
    //   alert('Vui lòng đăng nhập để thanh toán!');
    //   navigate('/login');
    //   return;
    // }

    // Kiểm tra giỏ hàng có trống không
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    // Tạo dữ liệu đơn hàng
    const orderData = {
      userId: user.id, // Lấy user.id từ AuthContext
      orderDetails: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      totalAmount: getTotalPrice(), // Tổng tiền của đơn hàng
    };

    try {
      // Gửi yêu cầu tạo đơn hàng lên backend
      await OrderService.create(orderData);

      // Xóa giỏ hàng sau khi tạo đơn hàng thành công
      clearCart();

      // Thông báo thành công và chuyển hướng người dùng về trang chủ
      alert('Đặt hàng thành công!');
      navigate('/'); // Hoặc chuyển đến trang xác nhận đơn hàng

    } catch (err) {
      console.error('Lỗi khi thanh toán:', err);
      setError(err.message || 'Không thể tạo đơn hàng.');
    }
  };

  return (
    <div className="cart">
      <Header />
      <Link to="/" className="back-link">Quay lại trang chủ</Link>
      <h1>Giỏ hàng của bạn</h1>
      {error && <div className="error">{error}</div>}
      {cart.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>Đơn giá: {item.price.toLocaleString('vi-VN')} VNĐ</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p>
                    Tổng: {(item.price * item.quantity).toLocaleString('vi-VN')}{' '}
                    VNĐ
                  </p>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Tóm tắt đơn hàng</h2>
            <p>Tổng tiền: {getTotalPrice().toLocaleString('vi-VN')} VNĐ</p>
            <button className="checkout-button" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </div>
      ) : (
        <p>Giỏ hàng của bạn đang trống!</p>
      )}
      <Footer /> {/* Thêm Footer */}
    </div>
  );
};

export default Cart;
