// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Import CartProvider
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import ClientHome from './frontend/ClientHome';
import ProductDetail from './frontend/ProductDetail.js';
import ProductCategory from './frontend/ProductCategory';
import Cart from './frontend/Cart';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Profile from './frontend/Profile.js';
import 'leaflet/dist/leaflet.css';
import SearchResults from './frontend/SearchResults.js';

function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Bọc toàn bộ ứng dụng trong CartProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<ClientHome />} />
            <Route path="/products" element={<ClientHome />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:id" element={<ProductCategory />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search" element={<SearchResults />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="category" element={<AdminCategories />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;