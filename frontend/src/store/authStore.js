import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOKEN_STORAGE_KEY } from "../utils/constants";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      isAuthenticated: () => Boolean(get().token),

      setSession: ({ token, user }) => {
        if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
        set({ token: token ?? get().token, user: user ?? get().user });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        set({ user: null, token: null });
      },
    }),
    {
      name: "indabaxhub-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

// Keep the store in sync with global 401 events from the axios interceptor.
if (typeof window !== "undefined") {
  window.addEventListener("indabaxhub:unauthorized", () => {
    useAuthStore.getState().logout();
  });
}
