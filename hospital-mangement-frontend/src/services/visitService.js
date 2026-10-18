
import api from "./api";

const unwrap = (response) =>
  response.data?.data ?? response.data;

export const getVisits = async () => {
  const response = await api.get("/api/visits");
  return unwrap(response);
};

export const getVisitById = async (visitId) => {
  const response = await api.get(`/api/visits/${visitId}`);
  return unwrap(response);
};

export const createVisit = async (visitData) => {
  const response = await api.post("/api/visits", visitData);
  return unwrap(response);
};

export const checkInVisit = async (visitId) => {
  const response = await api.post(
    `/api/visits/${visitId}/check-in`
  );
  return unwrap(response);
};
