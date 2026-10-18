import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

export const getMedicines = async () => {
  const response = await api.get("/api/medicines");
  return unwrap(response);
};

export const getMedicineById = async (medicineId) => {
  const response = await api.get(`/api/medicines/${medicineId}`);
  return unwrap(response);
};

export const searchMedicines = async (medicineName) => {
  const response = await api.get("/api/medicines/search", {
    params: { medicineName },
  });
  return unwrap(response);
};

export const createMedicine = async (medicineData) => {
  const response = await api.post("/api/medicines", medicineData);
  return unwrap(response);
};

export const updateMedicine = async (medicineId, medicineData) => {
  const response = await api.put(
    `/api/medicines/${medicineId}`,
    medicineData
  );
  return unwrap(response);
};