import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const nursingService = {
  // Assign a patient to a nurse
  assignPatient: async (data) =>
    unwrap(await api.post("/api/nursing/assignments", data)),

  // Find assignments for a specific nurse
  getAssignedPatients: async (nurseId) =>
    unwrap(await api.get(`/api/nursing/assignments/${nurseId}`)),

  // Create and update nursing notes
  addNursingNote: async (data) =>
    unwrap(await api.post("/api/nursing/notes", data)),

  updateNursingNote: async (noteId, data) =>
    unwrap(await api.put(`/api/nursing/notes/${noteId}`, data)),

  // Record medication administration
  administerMedication: async (data) =>
    unwrap(await api.post("/api/nursing/medications", data)),

  // View a patient's nursing notes
  getPatientNursingNotes: async (patientId) =>
    unwrap(await api.get(`/api/nursing/history/patient/${patientId}`)),

  // View a patient's medication administration history
  getPatientMedicationHistory: async (patientId) =>
    unwrap(await api.get(`/api/nursing/medications/patient/${patientId}`)),

  // Existing backend reference-data endpoints
  getPatients: async () => unwrap(await api.get("/api/patients")),

  getActiveAdmissions: async () =>
    unwrap(await api.get("/api/admissions/active")),

  getMedicines: async () => unwrap(await api.get("/api/medicines")),
};

export default nursingService;
