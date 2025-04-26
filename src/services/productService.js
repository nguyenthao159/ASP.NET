import httpAxios from "./httpAxios";
import axios from "axios";
const ProductServices = {
  // Lấy danh sách tất cả sản phẩm
  index: async () => {
    return (await httpAxios.get("/api/products")).data;
  },

  // Lấy thông tin sản phẩm theo ID
  show: async (id) => {
    return (await httpAxios.get(`/api/products/${id}`)).data;
  },

  // Thêm sản phẩm mới
  insert: async (data) => {
    return await httpAxios.post('/api/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Cập nhật sản phẩm theo ID
  update: async (id, data) => {
    return (await httpAxios.put(`/api/products/${id}`, data)).data;
  },

  // Xóa sản phẩm theo ID
  destroy: async (id) => {
    return (await httpAxios.delete(`/api/products/${id}`)).data;
  },
  getAllProducts: async () => {
    return (await httpAxios.get("/api/products")).data;
  },
  getListProductNew: async (limit = 9) => {
    return await axios.get(`/api/products/new?limit=${limit}`);
  },

  getProductById: async (id) => {
    return (await httpAxios.get(`/api/products/${id}`)).data;
  }
};

export default ProductServices;
