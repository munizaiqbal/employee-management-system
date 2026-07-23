// Services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://employee-management-system-1-gjsk.onrender.com/api", // ✅ backend base URL
});

// Example helper functions (optional)
export const fetchUserProfile = (token) =>
  api.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserProfile = (id, data, token) =>
  api.put(`/user/update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const fetchAllEmployees = (token) =>
  api.get("/employees", {
    headers: { Authorization: `Bearer ${token}` },
  });

// Default export for generic use
export default api;
