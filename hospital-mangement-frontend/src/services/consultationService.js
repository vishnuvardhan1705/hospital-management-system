import api from "./api";

const unwrap = (response) =>
  response.data?.data ?? response.data;

export const createConsultation = async (consultationData) => {
  const response = await api.post(
    "/api/consultations",
    consultationData
  );

  return unwrap(response);
};

export const getConsultationById = async (consultationId) => {
  const response = await api.get(
    `/api/consultations/${consultationId}`
  );

  return unwrap(response);
};

export const updateConsultation = async (
  consultationId,
  consultationData
) => {
  const response = await api.put(
    `/api/consultations/${consultationId}`,
    consultationData
  );

  return unwrap(response);
};

export const getPatientConsultations = async (patientId) => {
  const response = await api.get(
    `/api/consultations/patient/${patientId}`
  );

  return unwrap(response);
};

export const addDiagnosis = async (
  consultationId,
  diagnosisData
) => {
  const response = await api.post(
    `/api/consultations/${consultationId}/diagnosis`,
    diagnosisData
  );

  return unwrap(response);
};

export const addSymptoms = async (consultationId, symptomsData) => {
  const response = await api.post(
    `/api/consultations/${consultationId}/symptoms`,
    symptomsData
  );

  return unwrap(response);
};

export const addVitals = async (consultationId, vitalsData) => {
  const response = await api.post(
    `/api/consultations/${consultationId}/vitals`,
    vitalsData
  );

  return unwrap(response);
};