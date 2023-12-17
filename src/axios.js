import axios from "axios";
import apiUrl from "../config";

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

axiosInstance.interceptors.request.use((config) => {
  // Modify the request config as needed (e.g., attach authorization token)
  if (localStorage.getItem("token") !== null) {
    let tokenObject = localStorage.getItem("token");
    let accessToken = JSON.parse(tokenObject);
    config.headers.Authorization = "Bearer " + accessToken["access_token"];
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    if (error.response.status !== 401) {
      return Promise.reject(error);
    } else {
      axiosInstance
        .post("/api/refresh")
        .then((response) => {
          localStorage.setItem("token", JSON.stringify(response.data));
          window.location.reload();
        })
        .catch((error) => {
          if (error.response.status === 500) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
        });
    }
  }
);

export default axiosInstance;
