import api from "./api";

const unwrap = (response) =>
  response.data?.data ?? response.data;

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

// Dispense medicine against a prescription item.
export const dispenseMedicine = async (dispenseData) => {
  requireId(dispenseData.prescriptionItemId, "prescription item ID");
  requireId(dispenseData.batchId, "batch ID");

  if (!Number.isFinite(Number(dispenseData.quantity)) ||
      Number(dispenseData.quantity) <= 0) {
    throw new Error("Quantity must be greater than zero.");
  }

  const response = await api.post(
    "/api/pharmacy/dispense",
    dispenseData
  );

  return unwrap(response);
};

// Get pharmacy transactions for a medicine.
export const getTransactionsByMedicine = async (medicineId) => {
  requireId(medicineId, "medicine ID");

  const response = await api.get(
    `/api/pharmacy/transactions/medicine/${medicineId}`
  );

  return unwrap(response);
};

// Get pharmacy transactions for a batch.
export const getTransactionsByBatch = async (batchId) => {
  requireId(batchId, "batch ID");

  const response = await api.get(
    `/api/pharmacy/transactions/batch/${batchId}`
  );

  return unwrap(response);
};