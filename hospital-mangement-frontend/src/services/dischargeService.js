import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const dischargeService = {
  // Discharge records
  createDischarge: async (data) =>
    unwrap(await api.post("/api/discharges", data)),

  getDischarge: async (dischargeId) =>
    unwrap(await api.get(`/api/discharges/${dischargeId}`)),

  getPatientDischarges: async (patientId) =>
    unwrap(await api.get(`/api/discharges/patient/${patientId}`)),

  completeDischarge: async (dischargeId) =>
    unwrap(await api.post(`/api/discharges/${dischargeId}/complete`)),

  // Medicines prescribed for after discharge
  addMedication: async (dischargeId, data) =>
    unwrap(
      await api.post(`/api/discharges/${dischargeId}/medications`, data)
    ),

  getDischargeMedications: async (dischargeId) =>
    unwrap(await api.get(`/api/discharges/${dischargeId}/medications`)),

  // Existing backend resources
  getPatients: async () =>
    unwrap(await api.get("/api/patients")),

  getDoctors: async () =>
    unwrap(await api.get("/api/doctors")),

  getMedicines: async () =>
    unwrap(await api.get("/api/medicines")),

  getActiveAdmissions: async () =>
    unwrap(await api.get("/api/admissions/active")),
};

export default dischargeService;
