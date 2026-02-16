// SmartGain Frontend - User/Profile API Endpoints

import client from '../client';
import { User, UpdateProfileData } from '../types';

/**
 * User/Profile API endpoints
 */
export const userApi = {
  /**
   * Get current user profile
   * @returns Current user data
   */
  getProfile: (): Promise<User> => {
    return client.get<User>('/user/profile');
  },

  /**
   * Update user profile
   * @param data - Profile update data (goals, preferences, etc.)
   * @returns Updated user data
   */
  updateProfile: (data: UpdateProfileData): Promise<User> => {
    return client.put<User>('/user/profile', data);
  },
};
