"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/helpers/api";
import { User } from "@/types/user.types";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  hasChecked: boolean;
  loading: boolean;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => Promise<void>;
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
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      } else {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
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
      console.log("Failed to check session. Please log in again."+ error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
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
        localStorage.setItem('user', JSON.stringify(user));
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
      await api.post('/auth/logout');
      
      // Clear authorization header
      delete api.defaults.headers.common['Authorization'];
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      // Reset store state
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: true
      });
      // Navigation will be handled in the component that calls this function
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        token: null,
        hasChecked: true
      });
    }
  },
}));

// Custom hook for protected routes
export function useAuth() {
  const { user, isAuthenticated, loading, hasChecked } = useUserStore();
  const router = useRouter();
  const checkSession = useUserStore(state => state.checkSession);

  useEffect(() => {
    if (!hasChecked) {
      checkSession();
    } else if (!loading && (!user || !isAuthenticated)) {
      router.push("/login");
    }
  }, [user, isAuthenticated, loading, hasChecked, router, checkSession]);

  return { user, isAuthenticated, loading };
}

// Custom hook to handle logout with navigation
export function useLogout() {
  const logout = useUserStore(state => state.logout);
  const router = useRouter();

  return async () => {
    await logout();
    router.push('/');
  };
}

// Hook to initialize auth state from localStorage on app start
export function useInitializeAuth() {
  const setUser = useUserStore(state => state.setUser);
  const checkSession = useUserStore(state => state.checkSession);
  const hasChecked = useUserStore(state => state.hasChecked);

  useEffect(() => {
    if (!hasChecked) {
      const storedToken = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');
      
      if (storedToken && storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr) as User;
          setUser(storedUser, storedToken);
        } catch (error) {
          console.error('Failed to parse stored user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Fall back to API check if local storage data is invalid
          checkSession();
        }
      } else {
        // No local data found, check with API
        checkSession();
      }
    }
  }, [setUser, checkSession, hasChecked]);
}