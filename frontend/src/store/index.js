import { create } from "zustand";
import { persist } from "zustand/middleware";
import createUserSlice from "./useUserStore.js";



const useUserStore = create(
  persist(
    (...a) => ({
      ...createUserSlice(...a)
    }),
    { name: "user-store" }
  )
);

export { useUserStore };
