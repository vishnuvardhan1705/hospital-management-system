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

// Radiology test master

export const getRadiologyTests = async () =>
  unwrap(await api.get("/api/radiology-tests"));

export const getRadiologyTest = async (testId) =>
  unwrap(await api.get(
    `/api/radiology-tests/${requireId(testId, "test ID")}`
  ));

export const searchRadiologyTests = async (testName) =>
  unwrap(await api.get("/api/radiology-tests/search", {
    params: { testName },
  }));

export const createRadiologyTest = async (data) =>
  unwrap(await api.post("/api/radiology-tests", data));

export const updateRadiologyTest = async (testId, data) =>
  unwrap(await api.put(
    `/api/radiology-tests/${requireId(testId, "test ID")}`,
    data
  ));

// Radiology orders

export const createRadiologyOrder = async (data) =>
  unwrap(await api.post("/api/radiology-orders", data));

export const getRadiologyOrder = async (orderId) =>
  unwrap(await api.get(
    `/api/radiology-orders/${requireId(orderId, "order ID")}`
  ));

export const getRadiologyOrdersByPatient = async (patientId) =>
  unwrap(await api.get(
    `/api/radiology-orders/patient/${requireId(patientId, "patient ID")}`
  ));

export const getRadiologyOrdersByDoctor = async (doctorId) =>
  unwrap(await api.get(
    `/api/radiology-orders/doctor/${requireId(doctorId, "doctor ID")}`
  ));

export const getRadiologyOrdersByConsultation = async (consultationId) =>
  unwrap(await api.get(
    `/api/radiology-orders/consultation/${requireId(
      consultationId,
      "consultation ID"
    )}`
  ));

export const updateRadiologyOrder = async (orderId, data) =>
  unwrap(await api.put(
    `/api/radiology-orders/${requireId(orderId, "order ID")}`,
    data
  ));

export const scheduleRadiologyOrder = async (orderId) =>
  unwrap(await api.patch(
    `/api/radiology-orders/${requireId(orderId, "order ID")}/schedule`
  ));

// Radiology reports

export const createRadiologyReport = async (data) =>
  unwrap(await api.post("/api/radiology-reports", data));

export const verifyRadiologyReport = async (reportId, verifiedBy) =>
  unwrap(await api.patch(
    `/api/radiology-reports/${requireId(reportId, "report ID")}/verify`,
    null,
    { params: { verifiedBy } }
  ));

export const getRadiologyReportsByPatient = async (patientId) =>
  unwrap(await api.get(
    `/api/radiology-reports/patient/${requireId(patientId, "patient ID")}`
  ));