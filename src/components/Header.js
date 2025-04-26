import React, { useContext } from "react";
import {  Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NavDropdown } from "react-bootstrap";
import logo from "../Logo_-removebg-preview.png";

import "./Header.css";
import { FaUser } from "react-icons/fa";

const Header = () => {
  const { isAuthenticated, isAdmin, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName = user?.name || "Tài khoản";

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-button">
          Trang Chủ
        </Link>
        <Link to="/products" className="nav-button">
          Sản Phẩm
        </Link>
        <Link to="/cart" className="nav-button">
          Giỏ Hàng
        </Link>

        {/* User and Admin Section */}
        {isAuthenticated ? (
          <>
            <div className="user-section">
              <NavDropdown
                title={
                  <>
                    <FaUser className="me-1" /> {userName}
                  </>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  Tài khoản
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">
                  Đơn hàng
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </div>

            {isAdmin && (
              <Link to="/admin" className="nav-button">
                Quản Lý
              </Link>
            )}
          </>
        ) : (
          <Link to="/login" className="nav-button">
            <FaUser className="me-1" /> Đăng Nhập
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
