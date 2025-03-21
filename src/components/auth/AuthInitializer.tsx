'use client';

import { ReactNode, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface AuthInitializerProps {
  children: ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const checkSession = useUserStore(state => state.checkSession);
  const hasChecked = useUserStore(state => state.hasChecked);

  useEffect(() => {
    if (!hasChecked) {
      const storedToken = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');
      
      if (storedToken && storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          useUserStore.getState().setUser(storedUser, storedToken);
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
  }, [checkSession, hasChecked]);

  return <>{children}</>;
}