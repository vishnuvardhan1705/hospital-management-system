import api from "./api"

const unwrap = (response) => response.data?.data ?? response.data;

const requireId = (id, name = "ID") => {
  if (
    id === undefined ||
    id === null ||
    String(id).trim() === "" ||
    String(id) === "undefined" ||
    String(id) === "null"
  ) {
    throw new Error(`A valid ${name} is required.`);
  }

  return id;
};

export const createMedicineBatch = async (batchData) => {
  requireId(batchData.medicineId, "medicine ID");

  const response = await api.post(
    "/api/medicine-batches",
    batchData
  );

  return unwrap(response);
};

export const getMedicineBatch = async (batchId) => {
  requireId(batchId, "batch ID");

  const response = await api.get(
    `/api/medicine-batches/${batchId}`
  );

  return unwrap(response);
};

export const getBatchesByMedicine = async (medicineId) => {
  requireId(medicineId, "medicine ID");

  const response = await api.get(
    `/api/medicine-batches/medicine/${medicineId}`
  );

  return unwrap(response);
};

export const updateBatchStock = async (batchId, stockData) => {
  requireId(batchId, "batch ID");

  const response = await api.patch(
    `/api/medicine-batches/${batchId}/stock`,
    stockData
  );

  return unwrap(response);
};

export const getExpiredBatches = async () => {
  const response = await api.get(
    "/api/medicine-batches/expired"
  );

  return unwrap(response);
};

export const getLowStockBatches = async () => {
  const response = await api.get(
    "/api/medicine-batches/low-stock"
  );

  return unwrap(response);
};