import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const emergencyService = {
  // Emergency visits
  getAllVisits: async () =>
    unwrap(await api.get("/api/emergency-visits")),

  getVisit: async (visitId) =>
    unwrap(await api.get(`/api/emergency-visits/${visitId}`)),

  getPatientVisits: async (patientId) =>
    unwrap(await api.get(`/api/emergency-visits/patient/${patientId}`)),

  createVisit: async (data) =>
    unwrap(await api.post("/api/emergency-visits", data)),

  updateVisit: async (visitId, data) =>
    unwrap(await api.put(`/api/emergency-visits/${visitId}`, data)),

  assignDoctor: async (visitId, doctorId) =>
    unwrap(
      await api.patch(
        `/api/emergency-visits/${visitId}/doctor/${doctorId}`
      )
    ),

  startTreatment: async (visitId) =>
    unwrap(
      await api.post(`/api/emergency-visits/${visitId}/treatment`)
    ),

  dischargePatient: async (visitId) =>
    unwrap(
      await api.post(`/api/emergency-visits/${visitId}/discharge`)
    ),

  // Triage
  createTriageRecord: async (data) =>
    unwrap(await api.post("/api/triage-records", data)),

  getTriageByVisit: async (visitId) =>
    unwrap(
      await api.get(
        `/api/triage-records/emergency-visit/${visitId}`
      )
    ),

  getPatientTriageHistory: async (patientId) =>
    unwrap(
      await api.get(`/api/triage-records/patient/${patientId}`)
    ),

  // Supporting data
  getPatients: async () =>
    unwrap(await api.get("/api/patients")),

  getDoctors: async () =>
    unwrap(await api.get("/api/doctors")),

  // Emergency admission
  admitPatient: async (visitId, data) =>
    unwrap(
      await api.post(`/api/emergency/${visitId}/admit`, data)
    ),
};

export default emergencyService;
