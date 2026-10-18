
import api from "./api";

const unwrap = (response) =>
  response.data?.data ?? response.data;

export const getQueues = async () => {
  const response = await api.get("/api/queues");
  return unwrap(response);
};

export const getQueuesByDoctor = async (doctorId) => {
  const response = await api.get(`/api/queues/${doctorId}`);
  return unwrap(response);
};

export const generateQueueToken = async (visitId) => {
  const response = await api.post(
    `/api/queues/token/${visitId}`
  );

  return unwrap(response);
};

export const callQueuePatient = async (queueId) => {
  const response = await api.post(
    `/api/queues/${queueId}/call`
  );

  return unwrap(response);
};

export const completeQueuePatient = async (queueId) => {
  const response = await api.post(
    `/api/queues/${queueId}/complete`
  );

  return unwrap(response);
};