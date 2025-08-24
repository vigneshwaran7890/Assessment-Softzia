// src/store/useUserStore.js
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  login,
  logout,
  createUser,
  updateUser,
  getUser,
  deleteUser,
} from "../api/user";

const createUserSlice = (set, get) => ({
  id: "",
  name: "",
  email: "",
  role: "",
  accessToken: null,
  errors: {},

  // Set user state
  setUser: (userData) => set({ ...userData }),

  // Clear user state
  clearUser: () => {
    set({
      id: "",
      name: "",
      email: "",
      role: "",
      accessToken: null,
    });
    localStorage.removeItem("user-store");
    window.location.replace("/");
  },

  // Register user
  createUser: async (payload) => {
    try {
      const response = await createUser(payload);
      console.log("response 48", response);

      if (response.response && (response.response.status === 200 || response.response.status === 201)) {
        const { token, person } = response.response.data;
        set({
          accessToken: token,
          id: person.id,
          name: person.name || "",  // backend didn’t send `name`, fallback empty
          email: person.email,
          role: person.role || "user", // if role not given, fallback
        });
        localStorage.setItem("token", token);
        toast.success("User registered successfully");
        return person;
      } else if (response.error) {
        const msg = response.error.response?.data?.message || response.error.message;
        toast.error(msg);
        set((state) => ({ errors: { ...state.errors, register: msg } }));
        return null;
      }
    } catch (err) {
      toast.error(err.message || "Signup failed");
      return null;
    }
  },


  // Login user
  loginUser: async (payload) => {
    try {
      const response = await login(payload);
      console.log("response 69", response)
      if (response && response.data) {
        const { token, person } = response.data;
        set({
          accessToken: token,
          id: person.id,
          name: person.name || person.full_name,
          email: person.email,
          role: person.role,
        });
        localStorage.setItem("token", token);
        console.log("token", token)
        toast.success("Login successful");
        return true;
      } else if (response.error) {
        const msg = response.error.response?.data?.message || response.error.message;
        toast.error(msg);
        set((state) => ({ errors: { ...state.errors, login: msg } }));
        return false;
      }
    } catch (err) {
      toast.error(err.message || "Login failed");
      return false;
    }
  },

  // Logout
  logoutUser: async () => {
    try {
      const userId = get().id;
      await logout({ userId });
      get().clearUser();
    } catch (err) {
      toast.error(err.message || "Logout failed");
      set((state) => ({ errors: { ...state.errors, logout: err.message } }));
    }
  },



  // Update user
  updateUser: async (payload) => {
    try {
      const response = await updateUser(payload);
      if (response.response && response.response.status === 200) {
        const user = response.response.data.user;
        set({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        });
        toast.success("User updated successfully");
        return user;
      } else if (response.error) {
        const msg = response.error.response?.data?.message || response.error.message;
        toast.error(msg);
        return null;
      }
    } catch (err) {
      toast.error(err.message || "Update failed");
      return null;
    }
  },

  // Get user
  getUser: async () => {
    try {
      const response = await getUser();
      if (response.response && response.response.status === 200) {
        return response.response.data;
      } else if (response.error) {
        toast.error(response.error.message || "Failed to fetch user");
        return null;
      }
    } catch (err) {
      toast.error(err.message || "Fetch user failed");
      return null;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await deleteUser(id);
      if (response.response && response.response.status === 200) {
        toast.success("User deleted successfully");
        return true;
      } else if (response.error) {
        toast.error(response.error.message || "Delete failed");
        return false;
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
      return false;
    }
  },

  getAccessToken: () => get().accessToken,
});

export default createUserSlice;
