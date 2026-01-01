import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";
import { UserProfile } from "@/types";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  activeFamilyId: string | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setActiveFamilyId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;

  isAuthenticated: () => boolean;
  hasFamily: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      activeFamilyId: null,
      loading: true,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setActiveFamilyId: (activeFamilyId) => set({ activeFamilyId }),
      setLoading: (loading) => set({ loading }),

      isAuthenticated: () => !!get().user,
      hasFamily: () => !!get().profile?.familyIds?.length,
    }),
    {
      name: "mealplan-auth-storage",
      partialize: (state) => ({
        activeFamilyId: state.activeFamilyId,
      }),
    },
  ),
);
