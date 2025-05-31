import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL, HTTP_STATUS } from "./constants";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      "cookies",
      Cookies,
      localStorage,
      Cookies.get("access_token"),
      Cookies.get("refresh_token"),
      localStorage.getItem("refreshToken")
    );
    return response;
  },
  async (error) => {
    console.log(
      "Cookies",
      Cookies.get("refresh_token"),
      Cookies,
      localStorage.getItem("refreshToken")
    );
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === HTTP_STATUS.UNAUTHORIZED &&
      !originalRequest._retry &&
      localStorage.getItem("refreshToken")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/api/auth/refresh-token", {
          refreshToken: localStorage.getItem("refreshToken"),
        });
        const { access_token } = res.data;
        Cookies.set("access_token", access_token, { path: "/" });
        localStorage.setItem("token", access_token);
        originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
