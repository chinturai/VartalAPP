import { create } from "zustand";
import toast from 'react-hot-toast';

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "acid",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    toast.success(`${theme} theme applied successfully !`);
    set({ theme });
  },
}));