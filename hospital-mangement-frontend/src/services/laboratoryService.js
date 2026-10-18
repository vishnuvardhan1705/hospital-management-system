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

// ---------------- Laboratory Tests ----------------

export const getLabTests = async () =>
  unwrap(await api.get("/api/lab-tests"));

export const getLabTest = async (testId) =>
  unwrap(await api.get(
    `/api/lab-tests/${requireId(testId, "test ID")}`
  ));

export const searchLabTests = async (testName) =>
  unwrap(await api.get("/api/lab-tests/search", {
    params: { testName },
  }));

export const createLabTest = async (data) =>
  unwrap(await api.post("/api/lab-tests", data));

export const updateLabTest = async (testId, data) =>
  unwrap(await api.put(
    `/api/lab-tests/${requireId(testId, "test ID")}`,
    data
  ));

// ---------------- Laboratory Orders ----------------

export const createLabOrder = async (data) =>
  unwrap(await api.post("/api/lab-orders", data));

export const getLabOrder = async (orderId) =>
  unwrap(await api.get(
    `/api/lab-orders/${requireId(orderId, "lab order ID")}`
  ));

export const getLabOrdersByPatient = async (patientId) =>
  unwrap(await api.get(
    `/api/lab-orders/patient/${requireId(patientId, "patient ID")}`
  ));

export const getLabOrdersByConsultation = async (consultationId) =>
  unwrap(await api.get(
    `/api/lab-orders/consultation/${requireId(
      consultationId,
      "consultation ID"
    )}`
  ));

export const updateLabOrder = async (orderId, data) =>
  unwrap(await api.put(
    `/api/lab-orders/${requireId(orderId, "lab order ID")}`,
    data
  ));

export const addTestToLabOrder = async (orderId, testId) =>
  unwrap(await api.post(
    `/api/lab-orders/${requireId(orderId, "lab order ID")}/tests/${requireId(
      testId,
      "test ID"
    )}`
  ));

export const getLabOrderTests = async (orderId) =>
  unwrap(await api.get(
    `/api/lab-orders/${requireId(orderId, "lab order ID")}/tests`
  ));

// ---------------- Sample Collection ----------------

export const registerLabSample = async (data) =>
  unwrap(await api.post("/api/lab-samples", data));

export const getLabSample = async (sampleId) =>
  unwrap(await api.get(
    `/api/lab-samples/${requireId(sampleId, "sample ID")}`
  ));

export const getLabSamplesByPatient = async (patientId) =>
  unwrap(await api.get(
    `/api/lab-samples/patient/${requireId(patientId, "patient ID")}`
  ));

export const getLabSamplesByOrder = async (orderId) =>
  unwrap(await api.get(
    `/api/lab-samples/order/${requireId(orderId, "lab order ID")}`
  ));

export const updateLabSampleStatus = async (sampleId, status) =>
  unwrap(await api.patch(
    `/api/lab-samples/${requireId(sampleId, "sample ID")}/status`,
    null,
    { params: { status } }
  ));

// ---------------- Laboratory Results ----------------

export const createLabResult = async (data) =>
  unwrap(await api.post("/api/lab-results", data));

export const getLabResult = async (resultId) =>
  unwrap(await api.get(
    `/api/lab-results/${requireId(resultId, "result ID")}`
  ));

export const getLabResultsByOrderItem = async (orderItemId) =>
  unwrap(await api.get(
    `/api/lab-results/order-item/${requireId(
      orderItemId,
      "order item ID"
    )}`
  ));

export const verifyLabResult = async (resultId, verifiedBy) =>
  unwrap(await api.patch(
    `/api/lab-results/${requireId(resultId, "result ID")}/verify`,
    null,
    { params: { verifiedBy } }
  ));

// ---------------- Laboratory Reports ----------------

export const generateLabReport = async (data) =>
  unwrap(await api.post("/api/lab-reports", data));

export const getLabReport = async (reportId) =>
  unwrap(await api.get(
    `/api/lab-reports/${requireId(reportId, "report ID")}`
  ));

export const getLabReportsByPatient = async (patientId) =>
  unwrap(await api.get(
    `/api/lab-reports/patient/${requireId(patientId, "patient ID")}`
  ));

export const getLabReportsByOrder = async (orderId) =>
  unwrap(await api.get(
    `/api/lab-reports/order/${requireId(orderId, "lab order ID")}`
  ));
