import httpAxios from "./httpAxios";

const CategoryServices = {
  index: async () => {
    return (await httpAxios.get("/api/category")).data;
  },

  insert: async (data) => {
    return await httpAxios.post("/api/category", data); // đúng với POST api/category
  },

  update: async (id, data) => {
    return (await httpAxios.put(`/api/category/${id}`, data)).data; // dùng PUT
  },

  destroy: async (id) => {
    return (await httpAxios.delete(`/api/category/${id}`)).data;
  },

  show: async (id) => {
    return (await httpAxios.get(`/api/category/${id}`)).data;
  },

  // Các API dưới đây hiện chưa có trong controller .NET
  // Nếu bạn muốn dùng, cần tạo thêm các action tương ứng bên controller
  // Ví dụ: trash, restore, status, etc.

  // status: async (id) => {
  //   return (await httpAxios.get(`category/status/${id}`)).data;
  // },

  // delete: async (id) => {
  //   return await httpAxios.get(`category/delete/${id}`);
  // },

  // restore: async (id) => {
  //   return await httpAxios.get(`category/restore/${id}`);
  // },

  // trash: async () => {
  //   return await httpAxios.get("category/trash");
  // },

  
  
  GetCategories: async () => {
    return (await httpAxios.get("/api/category")).data;
  },
  
  getCategoryById: async (id) => {
    return (await httpAxios.get(`/api/category/${id}`)).data;
  }
};

export default CategoryServices;
