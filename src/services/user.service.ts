import { api, handleError } from '@/helpers/api';
import { User, UserCreateDTO, UserUpdateDTO, UserRole } from '@/types/user.types';

class UserService {
  /**
   * Get all users - admin only
   */
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get('/auth/admin/users');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch users: ${errorMessage}`);
    }
  }

  /**
   * Get user by ID - admin or instructor only
   */
  async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch user details: ${errorMessage}`);
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch current user profile: ${errorMessage}`);
    }
  }

  /**
   * Update current user profile
   */
  async updateProfile(profileData: UserUpdateDTO): Promise<User> {
    try {
      const response = await api.put('/auth/me', profileData);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update profile: ${errorMessage}`);
    }
  }

  /**
   * Update user role - admin only
   */
  async updateUserRole(userId: string, roles: UserRole[]): Promise<void> {
    if (!userId) {
      throw new Error('User ID is required to update roles');
    }
    
    try {
      await api.put(`/auth/admin/users/${userId}/roles`, { roles });
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to update user roles: ${errorMessage}`);
    }
  }

  /**
   * Register a new user
   */
  async registerUser(userData: UserCreateDTO): Promise<User> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Registration failed: ${errorMessage}`);
    }
  }

  /**
   * Login user
   */
  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post('/auth/login', { email, password });
      return {
        user: response.data.user,
        token: response.data.access_token
      };
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Login failed: ${errorMessage}`);
    }
  }

  /**
   * Logout user
   */
  async logoutUser(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Logout failed: ${errorMessage}`);
    }
  }

  /**
   * Get user statistics - admin only
   */
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    instructorUsers: number;
    studentUsers: number;
  }> {
    try {
      const response = await api.get('/auth/admin/stats');
      return response.data;
    } catch (error) {
      const errorMessage = handleError(error);
      throw new Error(`Failed to fetch user statistics: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const userService = new UserService();