// SmartGain Frontend - Progress Tracking API Endpoints

import client from '../client';
import {
  WeightLogData,
  WeightLog,
  DateRangeParams,
} from '../types';

/**
 * Progress tracking API endpoints
 */
export const progressApi = {
  /**
   * Log body weight and measurements
   * @param data - Weight log data with optional body measurements
   * @returns Created weight log with ID
   */
  logWeight: (data: WeightLogData): Promise<WeightLog> => {
    return client.post<WeightLog>('/progress/weight', data);
  },

  /**
   * Get weight logs for a specific time range
   * @param params - Optional date range or preset range (7d, 30d, 90d, all)
   * @returns Array of weight logs
   */
  getWeightLogs: (params?: DateRangeParams): Promise<WeightLog[]> => {
    return client.get<WeightLog[]>('/progress/weight', {
      params,
    });
  },

  /**
   * Get the latest weight log
   * @returns Most recent weight log
   */
  getLatestWeight: (): Promise<WeightLog> => {
    return client.get<WeightLog>('/progress/weight/latest');
  },
};
