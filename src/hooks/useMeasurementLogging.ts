import { useMutation, useQueryClient } from '@tanstack/react-query';
import { progressApi } from '@/api/endpoints/progress';
import { dashboardApi } from '@/api/endpoints/dashboard';
import { WeightLogData, WeightLog } from '@/api/types';
import { showMutationSuccess, showMutationError } from '@/lib/toast';
import { logError } from '@/lib/errorLogger';

/**
 * Hook for logging weight and measurements with optimistic updates
 */
export function useLogMeasurementMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WeightLogData) => {
      return await progressApi.logWeight(data);
    },
    onMutate: async (newData: WeightLogData) => {
      // Cancel any outgoing queries
      await queryClient.cancelQueries({ queryKey: ['weightLogs'] });
      await queryClient.cancelQueries({ queryKey: ['latestWeight'] });
      await queryClient.cancelQueries({ queryKey: ['dashboard'] });

      // Snapshot the previous values
      const previousWeightLogs = queryClient.getQueryData<WeightLog[]>(['weightLogs']);
      const previousLatestWeight = queryClient.getQueryData<WeightLog>(['latestWeight']);
      const previousDashboard = queryClient.getQueryData(['dashboard']);

      // Optimistically update weight logs
      const optimisticWeightLog: WeightLog = {
        id: `temp-${Date.now()}`,
        userId: '', // Will be provided by server
        ...newData,
        createdAt: new Date().toISOString(),
      };

      if (previousWeightLogs) {
        queryClient.setQueryData(['weightLogs'], [
          ...previousWeightLogs,
          optimisticWeightLog,
        ]);
      }

      // Optimistically update latest weight
      queryClient.setQueryData(['latestWeight'], optimisticWeightLog);

      // Optionally, optimistically update dashboard with new weight
      if (previousDashboard) {
        queryClient.setQueryData(['dashboard'], {
          ...previousDashboard,
          user: {
            ...previousDashboard.user,
            currentWeight: newData.weight,
          },
          todayStats: {
            ...previousDashboard.todayStats,
            currentWeight: newData.weight,
          },
        });
      }

      return { previousWeightLogs, previousLatestWeight, previousDashboard };
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['weightLogs'] });
      queryClient.invalidateQueries({ queryKey: ['latestWeight'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      // Show success toast
      showMutationSuccess('log measurement', 'Your measurements have been logged successfully.');
    },
    onError: (error, _newData, context) => {
      // Rollback to previous state
      if (context?.previousWeightLogs) {
        queryClient.setQueryData(['weightLogs'], context.previousWeightLogs);
      }
      if (context?.previousLatestWeight) {
        queryClient.setQueryData(['latestWeight'], context.previousLatestWeight);
      }
      if (context?.previousDashboard) {
        queryClient.setQueryData(['dashboard'], context.previousDashboard);
      }
      
      // Log error and show toast
      logError(error, 'Measurement Logging');
      showMutationError('log measurement', error);
    },
  });
}
