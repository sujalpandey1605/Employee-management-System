import api from "./api";

// Real Backend Login
export const loginApi = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    // JWT and User details returned in response.data
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || "Login failed. Please check your credentials.";
  }
};

// Real Backend Signup
export const signupApi = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup API Error:", error.response?.data);
    throw error.response?.data?.message || "Signup failed.";
  }
};

// Validate Token
export const validateToken = async () => {
  try {
    const response = await api.get("/auth/validate");
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Get all users (used for mapping IDs to names)
export const getAllUsers = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append("role", filters.role);
    if (filters.query) params.append("query", filters.query);
    
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const exportUsers = async () => {
  const response = await api.get("/users/export", { responseType: 'blob' });
  return response.data;
};
