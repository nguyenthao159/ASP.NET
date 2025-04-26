import httpAxios from './httpAxios';
import axios from "axios";
const API_URL = "https://localhost:7148/api/auth"; 
const UserService = {
  // Lấy danh sách tất cả người dùng
  getAll: async () => {
    return (await httpAxios.get("/api/user")).data;
  }
  ,
  getById: async (id) => {
    const response = await httpAxios.get(`/api/user/${id}`);
    return response.data;
  },
  create: async (userData) => {
    const response = await httpAxios.post('/api/user', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await httpAxios.put(`/api/user/${id}`, userData);
    return response.data;
  },
  remove: async (id) => {
    const response = await httpAxios.delete(`/api/user/${id}`);
    return response.data;
  },
  

  login: async (credentials) => {
    const res = await axios.post(`${API_URL}/login`, credentials);
    const token = res.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return token;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },
};

export default UserService;
