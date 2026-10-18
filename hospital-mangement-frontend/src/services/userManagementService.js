import api from "./api";

const userManagementService = {
  getAll: async () => (await api.get("/api/users")).data,

  getById: async (userId) =>
    (await api.get(`/api/users/${userId}`)).data,

  getRoles: async () => (await api.get("/api/roles")).data,

  create: async (data) =>
    (await api.post("/api/users", data)).data,

  update: async (userId, data) =>
    (await api.put(`/api/users/${userId}`, data)).data,

  updateStatus: async (userId, status) =>
    (
      await api.put(`/api/users/${userId}/status`, null, {
        params: { status },
      })
    ).data,

  resetPassword: async (userId, newPassword) =>
    (
      await api.put(`/api/users/${userId}/password`, {
        newPassword,
      })
    ).data,

  getUserRoles: async (userId) =>
    (await api.get(`/api/users/${userId}/roles`)).data,

  assignRole: async (userId, roleId) =>
    (
      await api.post(`/api/users/${userId}/roles`, {
        roleId: Number(roleId),
      })
    ).data,
};

export default userManagementService;
