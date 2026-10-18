import api  from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const inpatientService = {
  // Wards
  getWards: async () => unwrap(await api.get("/api/wards")),

  createWard: async (data) =>
    unwrap(await api.post("/api/wards", data)),

  updateWard: async (id, data) =>
    unwrap(await api.put(`/api/wards/${id}`, data)),

  getWardsByDepartment: async (departmentId) =>
    unwrap(await api.get(`/api/wards/department/${departmentId}`)),

  // Rooms
  getRooms: async () => unwrap(await api.get("/api/rooms")),

  createRoom: async (data) =>
    unwrap(await api.post("/api/rooms", data)),

  updateRoom: async (id, data) =>
    unwrap(await api.put(`/api/rooms/${id}`, data)),

  getRoomsByWard: async (wardId) =>
    unwrap(await api.get(`/api/rooms/ward/${wardId}`)),

  // Beds
  getBeds: async () => unwrap(await api.get("/api/beds")),

  createBed: async (data) =>
    unwrap(await api.post("/api/beds", data)),

  updateBed: async (id, data) =>
    unwrap(await api.put(`/api/beds/${id}`, data)),

  getBedsByRoom: async (roomId) =>
    unwrap(await api.get(`/api/beds/room/${roomId}`)),

  // Admissions
  getActiveAdmissions: async () =>
    unwrap(await api.get("/api/admissions/active")),

  getAdmission: async (id) =>
    unwrap(await api.get(`/api/admissions/${id}`)),

  createAdmission: async (data) =>
    unwrap(await api.post("/api/admissions", data)),

  updateAdmission: async (id, data) =>
    unwrap(await api.put(`/api/admissions/${id}`, data)),

  getPatientAdmissions: async (patientId) =>
    unwrap(await api.get(`/api/admissions/patient/${patientId}`)),

  approveAdmission: async (id) =>
    unwrap(await api.post(`/api/admissions/${id}/approve`)),

  assignDoctor: async (admissionId, doctorId) =>
    unwrap(
      await api.patch(
        `/api/admissions/${admissionId}/doctor/${doctorId}`
      )
    ),

  assignWard: async (admissionId, wardId) =>
    unwrap(
      await api.patch(
        `/api/admissions/${admissionId}/ward/${wardId}`
      )
    ),

  // Bed allocations
  allocateBed: async (data) =>
    unwrap(await api.post("/api/bed-allocations", data)),

  releaseBed: async (allocationId) =>
    unwrap(
      await api.post(`/api/bed-allocations/${allocationId}/release`)
    ),

  getAdmissionAllocationHistory: async (admissionId) =>
    unwrap(
      await api.get(`/api/bed-allocations/admission/${admissionId}`)
    ),

  getPatientAllocationHistory: async (patientId) =>
    unwrap(
      await api.get(`/api/bed-allocations/patient/${patientId}`)
    ),

  // Reference data used by the forms
  getPatients: async () => unwrap(await api.get("/api/patients")),

  getDoctors: async () => unwrap(await api.get("/api/doctors")),

  getDepartments: async () =>
    unwrap(await api.get("/api/departments")),
};

export default inpatientService;
