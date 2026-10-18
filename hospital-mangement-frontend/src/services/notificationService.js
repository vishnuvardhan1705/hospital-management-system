import api from "./api";

const unwrap = (response) => response.data?.data ?? response.data;

const notificationService = {
  getAll: async () =>
    unwrap(await api.get("/api/notifications")),

  getByUser: async (userId) =>
    unwrap(await api.get(`/api/notifications/user/${userId}`)),

  getByPatient: async (patientId) =>
    unwrap(await api.get(`/api/notifications/patient/${patientId}`)),

  create: async (data) =>
    unwrap(await api.post("/api/notifications", data)),

  markAsRead: async (notificationId) =>
    unwrap(
      await api.patch(`/api/notifications/${notificationId}/read`)
    ),

  createAppointmentNotification: async (data) =>
    unwrap(await api.post("/api/notifications/appointment", data)),

  createLabNotification: async (data) =>
    unwrap(await api.post("/api/notifications/lab", data)),

  createPaymentNotification: async (data) =>
    unwrap(await api.post("/api/notifications/payment", data)),

  createFollowUpNotification: async (data) =>
    unwrap(await api.post("/api/notifications/follow-up", data)),
};

export default notificationService;

