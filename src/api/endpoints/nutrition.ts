// SmartGain Frontend - Nutrition API Endpoints

import client from '../client';
import {
  CalculatorData,
  CalculatorResults,
  MealLogData,
  MealLog,
  MealPlan,
  DateRangeParams,
} from '../types';

/**
 * Nutrition API endpoints
 */
export const nutritionApi = {
  /**
   * Calculate daily calorie and macro recommendations
   * @param data - User data for calculation (age, weight, activity level, etc.)
   * @returns Calculated daily calories and macros
   */
  calculate: async (data: CalculatorData): Promise<CalculatorResults> => {
    const response = await client.post<{ success: boolean; data: CalculatorResults }>('/nutrition/calculate', data);
    return response.data;
  },

  /**
   * Log a meal with calorie and macro information
   * @param data - Meal log data
   * @returns Created meal log with ID
   */
  logMeal: (data: MealLogData): Promise<MealLog> => {
    return client.post<MealLog>('/nutrition/logs', data);
  },

  /**
   * Get meal logs for a specific date or date range
   * @param params - Date filter or range parameters
   * @returns Array of meal logs
   */
  getMealLogs: (params?: string | DateRangeParams): Promise<MealLog[]> => {
    // Handle legacy single date string or new object params
    const queryParams = typeof params === 'string' ? { date: params } : params;

    return client.get<MealLog[]>('/nutrition/logs', {
      params: queryParams,
    });
  },

  /**
   * Get the user's current meal plan
   * @returns Current meal plan with daily meals
   */
  getMealPlan: (): Promise<MealPlan> => {
    return client.get<MealPlan>('/nutrition/meal-plan');
  },

  /**
   * Generate a new meal plan based on user goals
   * @returns Newly generated meal plan
   */
  generateMealPlan: (): Promise<MealPlan> => {
    return client.post<MealPlan>('/nutrition/meal-plan/generate');
  },
};
