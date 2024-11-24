import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

interface TaskFormData {
  title: string;
  description: string;
  scheduled_on: string;
}

const user_api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

user_api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default user_api;

export const taskApi = {
  getAllTasks: () => user_api.get("api/task/"),
  createTask: (task: TaskFormData) => user_api.post("api/task/", task),
  updateTask: (id: string, task: TaskFormData) =>
    user_api.put(`api/task/${id}/`, task),
  deleteTask: (id: string) => user_api.delete(`api/task/${id}/`),
  markComplete: (id: string) => user_api.post(`api/task/${id}/mark_complete/`),
};
