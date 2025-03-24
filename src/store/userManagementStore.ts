'use client';

import { create } from 'zustand';
import { User, UserRole } from '@/types/user.types';
import { userService } from '@/services/user.service';

interface UserManagementState {
  // Data
  users: User[];
  filteredUsers: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Filter state
  searchTerm: string;
  selectedRole: string | null;
  
  // Filter actions
  setSearchTerm: (term: string) => void;
  setSelectedRole: (role: string | null) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  
  // Data actions
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User>;
  updateUserRole: (id: string, roles: UserRole[]) => Promise<void>;
  selectUser: (user: User | null) => void;
}

export const useUserManagementStore = create<UserManagementState>((set, get) => ({
  // Initial state
  users: [],
  filteredUsers: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  selectedRole: null,
  
  // Filter setters
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().applyFilters();
  },
  
  setSelectedRole: (role) => {
    set({ selectedRole: role });
    get().applyFilters();
  },
  
  // Filter actions
  applyFilters: () => {
    const { users, searchTerm, selectedRole } = get();
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(
        user => 
          user.firstName.toLowerCase().includes(lowerSearchTerm) ||
          user.lastName.toLowerCase().includes(lowerSearchTerm) ||
          user.email.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply role filter
    if (selectedRole) {
      result = result.filter(user => user.role.includes(selectedRole));
    }
    
    set({ filteredUsers: result });
  },
  
  resetFilters: () => {
    set({ 
      searchTerm: '',
      selectedRole: null,
      filteredUsers: get().users
    });
  },
  
  // Data actions
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const users = await userService.getUsers();
      set({ 
        users, 
        filteredUsers: users, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
    }
  },
  
  getUserById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const user = await userService.getUserById(id);
      set({ isLoading: false });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateUserRole: async (id, roles) => {
    set({ isLoading: true, error: null });
    
    try {
      await userService.updateUserRole(id, roles);
      
      // Update user in the store
      set(state => {
        const updatedUsers = state.users.map(user => {
          if (user.id === id) {
            // Replace the entire roles array with the new selection
            return { ...user, role: roles };
          }
          return user;
        });
        
        return {
          users: updatedUsers,
          isLoading: false
        };
      });
      
      // Re-apply filters to update filteredUsers as well
      get().applyFilters();
      
    } catch (error) {
      console.error('Error updating user roles:', error);
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred', 
        isLoading: false 
      });
      throw error;
    }
  },
  
  selectUser: (user) => {
    set({ selectedUser: user });
  }
}));