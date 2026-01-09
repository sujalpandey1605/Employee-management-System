import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082/api", // Task Service Port
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getTasksByManager = async (managerId) => {
  const response = await api.get(`/tasks/manager/${managerId}`);
  return response.data;
};

export const getTasksByAssignee = async (userId) => {
  const response = await api.get(`/tasks/assignee/${userId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const updateTaskStatus = async (taskId, status, remark = "") => {
  const response = await api.patch(`/tasks/${taskId}/status?status=${status}&remark=${remark}`);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};

export default api;
