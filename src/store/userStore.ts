"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/helpers/api";

// User interfaces remain the same
export interface User {
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  bio: string;
  role: string[];
  graduationYear: number;
  interests: string[];
  lookingForMentor: boolean;
  willingToMentor: boolean;
  connectionsMade: number;
  accountCreatedAt: string;
  isActive: boolean;
  isVerified: boolean;
  program: string;
  phoneCode: string;
  languages: string[];
  certifications: string[];
  projects: string[];
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  hasChecked: boolean;
  loading: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
}

export const useUserStore = create<UserState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  token: null,
  hasChecked: false,


  checkSession: async () => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        hasChecked: true
      });
      return;
    }
    try {
      set({ loading: true });
      const response = await api.get("/token/verify", {
        withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${storedToken || get().token}`
            }
      });
      if (response.status === 200 && response.data.user) {
        set({
          user: response.data.user,
          token: response.data.token,
          isAuthenticated: true,
          loading: false,
          hasChecked: true
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.data.token);
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          hasChecked: true
        });
      }
    } catch (error) {
      // toast.error("Failed to check session. Please log in again.");
      localStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        hasChecked: true
      });
    }
  },

  setUser: (user: User, token: string) => {
    if (token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      hasChecked: true
    });
  },

  logout: async () => {
    try {
      set({ loading: false, hasChecked: true });
      await api.patch('/auth/logout');
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      
      // Reset store state
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: false
      });
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: false
      });
    }
  },
}));

// Custom hook for protected routes
export function useAuth() {
  const { user, isAuthenticated, loading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAuthenticated)) {
      router.push("/login");
    }
  }, [user, isAuthenticated, loading, router]);

  return { user, isAuthenticated, loading };
}

export function useInitializeAuth() {
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        useUserStore.getState().setUser(user, storedToken);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
}