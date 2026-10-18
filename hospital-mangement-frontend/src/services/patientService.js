import api from "./api";

const getResponseData = (response) =>{
    return response.data?.data ?? response.data;
};

export const getPatients = async () => {
    const response = await api.get("/api/patients");
    const result = getResponseData(response);

    if (Array.isArray(result)) {
        return result;
    }

    if (Array.isArray(result?.content)) {
        return result.content;
    }

    return [];
};

export const createPatient = async (patientData) => {
    const response = await api.post("/api/patients", patientData);
    return getResponseData(response);
};

export const getPatientById = async (patientId) => {
    const response = await api.get(`/api/patients/${patientId}`);
    return getResponseData(response);
};