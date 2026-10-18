import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const followUpService = {
  createFollowUp: async (data) =>
    unwrap(await api.post("/api/follow-ups", data)),

  updateFollowUp: async (followUpId, data) =>
    unwrap(await api.put(`/api/follow-ups/${followUpId}`, data)),

  getFollowUp: async (followUpId) =>
    unwrap(await api.get(`/api/follow-ups/${followUpId}`)),

  getPatientFollowUps: async (patientId) =>
    unwrap(await api.get(`/api/follow-ups/patient/${patientId}`)),

  getUpcomingFollowUps: async () =>
    unwrap(await api.get("/api/follow-ups/upcoming")),

  completeFollowUp: async (followUpId) =>
    unwrap(await api.patch(`/api/follow-ups/${followUpId}/complete`)),

  cancelFollowUp: async (followUpId) =>
    unwrap(await api.patch(`/api/follow-ups/${followUpId}/cancel`)),

  getPatients: async () =>
    unwrap(await api.get("/api/patients")),

  getDoctors: async () =>
    unwrap(await api.get("/api/doctors")),
};

export default followUpService;