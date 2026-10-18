import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const insuranceService = {
  // Patient insurance policies
  createPolicy: async (data) =>
    unwrap(await api.post("/api/insurance/policies", data)),

  getPatientInsurance: async (patientId) =>
    unwrap(await api.get(`/api/patients/${patientId}/insurance`)),

  // Insurance claims
  createClaim: async (data) =>
    unwrap(await api.post("/api/insurance/claims", data)),

  getClaim: async (claimId) =>
    unwrap(await api.get(`/api/insurance/claims/${claimId}`)),

  submitClaim: async (claimId) =>
    unwrap(await api.post(`/api/insurance/claims/${claimId}/submit`)),

  settleClaim: async (claimId, data) =>
    unwrap(await api.post(`/api/insurance/claims/${claimId}/settle`, data)),

  // Existing patient API
  getPatients: async () =>
    unwrap(await api.get("/api/patients")),

  // Existing bill API
  getBill: async (billId) =>
    unwrap(await api.get(`/api/bills/${billId}`)),
};

export default insuranceService;
