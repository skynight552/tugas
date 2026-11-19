import axios from "axios";

// Axios instance terpusat sesuai materi REST API dan HTTP Client.
const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
