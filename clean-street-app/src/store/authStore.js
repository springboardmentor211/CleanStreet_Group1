import { create } from "zustand";   // ✅ use named import

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  }
}));

export default useAuthStore;
