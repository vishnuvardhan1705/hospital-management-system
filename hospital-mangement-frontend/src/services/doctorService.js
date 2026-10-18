import api from "./api";

export async function getDoctors() {
  const response = await api.get("/api/doctors");
  return response.data;
}

export async function getDoctorById(doctorId) {
  const response = await api.get(`/api/doctors/${doctorId}`);
  return response.data;
}

export async function getDoctorsByHospital(hospitalId) {
  const response = await api.get(`/api/doctors/hospitals/${hospitalId}`);
  return response.data;
}

export async function getDoctorsByDepartment(departmentId) {
  const response = await api.get(
    `/api/doctors/departments/${departmentId}`
  );
  return response.data;
}

export async function createDoctor(doctor) {
  const response = await api.post("/api/doctors", doctor);
  return response.data;
}

export async function updateDoctor(doctorId, doctor) {
  const response = await api.put(`/api/doctors/${doctorId}`, doctor);
  return response.data;
}

export async function getDoctorSchedules(doctorId) {
  const response = await api.get(
    `/api/doctors/${doctorId}/schedule`
  );
  return response.data;
}

export async function getDoctorScheduleById(scheduleId) {
  const response = await api.get(
    `/api/doctors/schedule/${scheduleId}`
  );
  return response.data;
}

export async function createDoctorSchedule(doctorId, schedule) {
  // The controller sets doctorId from the URL.
  const response = await api.post(
    `/api/doctors/${doctorId}/schedule`,
    schedule
  );
  return response.data;
}

export async function updateDoctorSchedule(scheduleId, schedule) {
  const response = await api.put(
    `/api/doctors/schedule/${scheduleId}`,
    schedule
  );
  return response.data;
}