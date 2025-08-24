import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUserStore } from "../../store";

export let BASEURL = "http://localhost:5000";

// Create an Axios instance
const instance = axios.create({
  baseURL: BASEURL,
  timeout: 30000, // 30 seconds
});

// Request interceptor to include the access token in every request
instance.interceptors.request.use(
  (config) => {
    // Get the latest access token from the store
    const accessToken = useUserStore.getState().getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Handle FormData correctly
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle notifications
instance.interceptors.response.use(
  (response) => {
    const status = response?.data?.status;
    const message = response?.data?.message;

    if (status === 200 && message) toast.success(message);
    else if (status === 400 && message) toast.error(message);
    else if (status === 401 && message) toast.warning(message);

    return response;
  },
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      if (message === "Invalid Credentials") {
        toast.error("Invalid Credentials. Please try again.");
      } else {
        // Optional: log out user if token expired
        // useUserStore.getState().logoutUser(useUserStore.getState().LogginedUserId);
        // toast.warning(message || "Unauthorized access. Please log in.");
      }
    } else if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default instance;
