import api from "./api";

const leaderboardService = {
  async getGlobal(params = {}) {
    const { data } = await api.get("/leaderboard", { params });
    return data;
  },

  async getByCompetition(competitionId) {
    const { data } = await api.get(`/leaderboard/${competitionId}`);
    return data;
  },
};

export default leaderboardService;
