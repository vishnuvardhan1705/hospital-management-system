import api from "./api";

const unwrap = (response) =>
  response.data?.data ?? response.data;

export const createPrescription = async (
  consultationId,
  prescriptionData
) => {
  const response = await api.post(
    `/api/consultations/${consultationId}/prescriptions`,
    prescriptionData
  );

  return unwrap(response);
};

export const getPrescription = async (prescriptionId) => {
  const response = await api.get(
    `/api/prescriptions/${prescriptionId}`
  );

  return unwrap(response);
};

export const getPatientPrescriptions = async (patientId) => {
  const response = await api.get(
    `/api/patients/${patientId}/prescriptions`
  );

  return unwrap(response);
};

export const getActivePrescriptions = async () => {
  const response = await api.get("/api/prescriptions/active");
  return unwrap(response);
};

export const updatePrescription = async (
  consultationId,
  prescriptionData
) => {
  const response = await api.put(
    `/api/consultations/${consultationId}/prescriptions`,
    prescriptionData
  );

  return unwrap(response);
};

export const addPrescriptionMedicine = async (
  prescriptionId,
  medicineData
) => {
  const response = await api.post(
    `/api/prescriptions/${prescriptionId}/medicines`,
    medicineData
  );

  return unwrap(response);
};

export const getPrescriptionMedicines = async (prescriptionId) => {
  const response = await api.get(
    `/api/prescriptions/${prescriptionId}/medicines`
  );

  return unwrap(response);
};

export const removePrescriptionMedicine = async (
  prescriptionItemId
) => {
  const response = await api.delete(
    `/api/prescription-item/${prescriptionItemId}`
  );

  return unwrap(response);
};

export const dispensePrescription = async (prescriptionId) => {
  const response = await api.post(
    `/api/prescriptions/${prescriptionId}/dispense`
  );

  return unwrap(response);
};