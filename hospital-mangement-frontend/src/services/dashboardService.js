
import api from "./api";

const dashboardService = {
  getProfile: async () =>
    (await api.get("/api/auth/profile")).data,

  getPatients: async () =>
    (await api.get("/api/reports/patients")).data,

  getAppointments: async () =>
    (await api.get("/api/reports/appointments")).data,

  getFinancial: async () =>
    (await api.get("/api/reports/financial")).data,

  getPharmacy: async () =>
    (await api.get("/api/reports/pharmacy")).data,

  getLaboratory: async () =>
    (await api.get("/api/reports/laboratory")).data,

  getAdmissions: async () =>
    (await api.get("/api/reports/admissions")).data,
};

export default dashboardService;
