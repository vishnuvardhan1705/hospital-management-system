import api from "./api";

const auditLogService = {
  getAll: async () =>
    (await api.get("/api/audit-logs")).data,

  getByUser: async (userId) =>
    (await api.get(`/api/audit-logs/user/${userId}`)).data,

  getEntityHistory: async (entityName, entityId) =>
    (
      await api.get(
        `/api/audit-logs/entity/${encodeURIComponent(entityName)}/${entityId}`
      )
    ).data,

  getPatientAccessHistory: async (patientId) =>
    (
      await api.get(
        `/api/audit-logs/patient/${patientId}/access-history`
      )
    ).data,

  create: async (data) =>
    (await api.post("/api/audit-logs", data)).data,
};

export default auditLogService;
