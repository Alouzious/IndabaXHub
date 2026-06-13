import api from "./api";

const competitionService = {
  async getAll(params = {}) {
    const { data } = await api.get("/competitions", { params });
    return data;
  },

  async getOne(id) {
    const { data } = await api.get(`/competitions/${id}`);
    return data;
  },

  async getLeaderboard(id) {
    const { data } = await api.get(`/leaderboard/${id}`);
    return data;
  },
};

export default competitionService;
