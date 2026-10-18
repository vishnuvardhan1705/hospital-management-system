import api from "./api";

function getResponseData(response){
    return response.data?.data ?? response.data;
}

export const getPatientAppointments = async (patientId) => {
  const response = await api.get(
    `/api/appointments/patient/${patientId}`
  );

  const data = response.data?.data ?? response.data;

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  return [];
};

export async function getAppointmentById(appointmentId) {
    const response = await api.get(
        `/api/appointments/${appointmentId}`
    );

    return getResponseData(response);
}

export async function createAppointment(appointmentData) {
    const response = await api.post("/api/appointments",appointmentData);

    return getResponseData(response);
}

export async function updateAppointment(appointmentId, appointmentData) {
    const response = await api.put(
        `/api/appointments/${appointmentId}`,
        appointmentData
    );

    return getResponseData(response);
}

export async function confirmAppointment(appointmentId) {
    const response = await api.post(
        `/api/appointments/${appointmentId}/confirm`
    );

    return getResponseData(response);
}

export async function cancelAppointment(appointmentId) {
    const response = await api.post(
        `/api/appointments/${appointmentId}/cancel`
    );

    return getResponseData(response);
}

export async function deleteAppointment(appointmentId) {
    const response = await api.delete(
        `/api/appointments/${appointmentId}`
    );

    return getResponseData(response);
}