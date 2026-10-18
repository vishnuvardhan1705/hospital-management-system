import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const billingService = {
  // Bills
  createBill: async (data) =>
    unwrap(await api.post("/api/bills", data)),

  getBill: async (billId) =>
    unwrap(await api.get(`/api/bills/${billId}`)),

  updateBill: async (billId, data) =>
    unwrap(await api.put(`/api/bills/${billId}`, data)),

  getPatientBills: async (patientId) =>
    unwrap(await api.get(`/api/patients/${patientId}/bills`)),

  calculateBill: async (billId) =>
    unwrap(await api.post(`/api/bills/${billId}/calculate`)),

  finalizeBill: async (billId) =>
    unwrap(await api.post(`/api/bills/${billId}/finalize`)),

  cancelBill: async (billId) =>
    unwrap(await api.post(`/api/bills/${billId}/cancel`)),

  // Bill items
  getBillItems: async (billId) =>
    unwrap(await api.get(`/api/bills/${billId}/items`)),

  addBillItem: async (billId, data) =>
    unwrap(await api.post(`/api/bills/${billId}/items`, data)),

  removeBillItem: async (billId, billItemId) =>
    unwrap(
      await api.delete(`/api/bills/${billId}/items/${billItemId}`)
    ),

  // Payments
  createPayment: async (data) =>
    unwrap(await api.post("/api/payments", data)),

  getPayments: async (billId) =>
    unwrap(await api.get(`/api/bills/${billId}/payments`)),

  getPayment: async (paymentId) =>
    unwrap(await api.get(`/api/payments/${paymentId}`)),

  // Refund requests
  createRefund: async (paymentId, data) =>
    unwrap(await api.post(`/api/payments/${paymentId}/refund`, data)),

  // Supporting data
  getPatients: async () =>
    unwrap(await api.get("/api/patients")),
};

export default billingService;
