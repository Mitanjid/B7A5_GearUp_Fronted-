import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (user: User, accessToken: string) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      login: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      logout: () => {
        Cookies.remove("accessToken");
        Cookies.remove("userRole");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "gearup-auth-storage",
      onRehydrateStorage: () => (state?: AuthState) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
