import api from "./api";

const datasetService = {
  async getAll(params = {}) {
    const { data } = await api.get("/datasets", { params });
    return data; // { items, total, page, page_size } or array
  },

  async getOne(id) {
    const { data } = await api.get(`/datasets/${id}`);
    return data;
  },

  async upload(formData, onUploadProgress) {
    const { data } = await api.post("/datasets", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return data;
  },

  async download(id) {
    const { data } = await api.get(`/datasets/${id}/download`);
    return data; // { url } presigned download URL
  },

  async getMine() {
    const { data } = await api.get("/datasets", { params: { mine: true } });
    return data;
  },
};

export default datasetService;
