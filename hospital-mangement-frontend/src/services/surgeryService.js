import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const surgeryService = {
  // Surgery types
  getSurgeryTypes: async () =>
    unwrap(await api.get("/api/surgery-types")),

  createSurgeryType: async (data) =>
    unwrap(await api.post("/api/surgery-types", data)),

  // Operation theatres
  getOperationTheatres: async () =>
    unwrap(await api.get("/api/operation-theatres")),

  createOperationTheatre: async (data) =>
    unwrap(await api.post("/api/operation-theatres", data)),

  // Surgery requests
  createSurgeryRequest: async (data) =>
    unwrap(await api.post("/api/surgeries/requests", data)),

  getSurgeryRequest: async (requestId) =>
    unwrap(await api.get(`/api/surgeries/requests/${requestId}`)),

  approveSurgeryRequest: async (requestId) =>
    unwrap(await api.post(`/api/surgeries/${requestId}/approve`)),

  // Schedule and manage surgeries
  scheduleSurgery: async (requestId, data) =>
    unwrap(await api.post(`/api/surgeries/${requestId}/schedule`, data)),

  startSurgery: async (surgeryId) =>
    unwrap(await api.post(`/api/surgeries/${surgeryId}/start`)),

  completeSurgery: async (surgeryId, data) =>
    unwrap(await api.post(`/api/surgeries/${surgeryId}/complete`, data)),

  cancelSurgery: async (surgeryId) =>
    unwrap(await api.post(`/api/surgeries/${surgeryId}/cancel`)),

  getSurgeriesByPatient: async (patientId) =>
    unwrap(await api.get(`/api/surgeries/patient/${patientId}`)),

  getSurgeriesByStatus: async (status) =>
    unwrap(await api.get(`/api/surgeries/status/${status}`)),

  // Supporting data
  getPatients: async () =>
    unwrap(await api.get("/api/patients")),

  getDoctors: async () =>
    unwrap(await api.get("/api/doctors")),

  getAdmissions: async () =>
    unwrap(await api.get("/api/admissions/active")),
};

export default surgeryService;
