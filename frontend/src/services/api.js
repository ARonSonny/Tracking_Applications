import axios from "axios";

const API_URL = "https://tracking-application-backend.onrender.com";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);

export const getApplications = () => api.get("/applications/");
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post("/applications/", data);
export const updateApplication = (id, data) => api.patch(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export const getContacts = () => api.get("/contacts/");
export const createContact = (data) => api.post("/contacts/", data);
export const updateContact = (id, data) => api.patch(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);

export default api;