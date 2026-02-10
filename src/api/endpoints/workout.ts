// SmartGain Frontend - Workout API Endpoints

import client from '../client';
import {
  WorkoutLogData,
  WorkoutLog,
  WorkoutPlan,
  DateRangeParams,
} from '../types';

/**
 * Workout API endpoints
 */
export const workoutApi = {
  /**
   * Log a workout session
   * @param data - Workout log data
   * @returns Created workout log with ID
   */
  logWorkout: (data: WorkoutLogData): Promise<WorkoutLog> => {
    return client.post<WorkoutLog>('/workout/logs', data);
  },

  /**
   * Get workout logs for a specific date or date range
   * @param params - Date filter or range parameters
   * @returns Array of workout logs
   */
  getWorkoutLogs: (params?: string | DateRangeParams): Promise<WorkoutLog[]> => {
    // Handle legacy single date string or new object params
    const queryParams = typeof params === 'string' ? { date: params } : params;

    return client.get<WorkoutLog[]>('/workout/logs', {
      params: queryParams,
    });
  },

  /**
   * Get the user's current workout plan
   * @returns Current workout plan with daily workouts
   */
  getWorkoutPlan: (): Promise<WorkoutPlan> => {
    return client.get<WorkoutPlan>('/workout/plan');
  },

  /**
   * Generate a new workout plan based on user goals
   * @returns Newly generated workout plan
   */
  generateWorkoutPlan: (): Promise<WorkoutPlan> => {
    return client.post<WorkoutPlan>('/workout/plan/generate');
  },
};
