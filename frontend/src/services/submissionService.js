import api from "./api";

const submissionService = {
  async submit(competitionId, file, onUploadProgress) {
    const formData = new FormData();
    formData.append("competition_id", competitionId);
    formData.append("file", file);
    const { data } = await api.post("/submissions", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return data;
  },

  async getMySubmissions() {
    const { data } = await api.get("/submissions/me");
    return data;
  },
};

export default submissionService;
