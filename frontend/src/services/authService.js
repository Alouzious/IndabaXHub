import api from "./api";

const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    return data; // { access_token, token_type, user }
  },

  async register(payload) {
    // payload: { email, username, password }
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    return data;
  },
};

export default authService;
