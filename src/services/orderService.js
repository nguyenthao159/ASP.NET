import httpAxios from './httpAxios';

const OrderService = {
  // Lấy tất cả đơn hàng của user
  getAll: async () => {
    const response = await httpAxios.get('/api/order');
    return response.data;
  },

  // Lấy chi tiết một đơn hàng theo ID
  getById: async (id) => {
    const response = await httpAxios.get(`/api/order/${id}`);
    return response.data;
  },

  // Tạo đơn hàng mới
  create: async (orderData) => {
    const response = await httpAxios.post('/api/order', orderData);
    return response.data;
  },

  // Cập nhật đơn hàng (patch)
  update: async (id, updateData) => {
    const response = await httpAxios.patch(`/api/order/${id}`, updateData);
    return response.data;
  },

  // Xoá đơn hàng
  remove: async (id) => {
    const response = await httpAxios.delete(`order/${id}`);
    return response.data;
  }
};

export default OrderService;
