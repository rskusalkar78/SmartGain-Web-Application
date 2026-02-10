import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { progressApi } from '@/api/endpoints/progress';
import { MeasurementLogger } from '@/components/features/MeasurementLogger';
import { useLogMeasurementMutation } from '@/hooks/useMeasurementLogging';
import { WeightLogData } from '@/api/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function Progress() {
  // Fetch latest weight for comparison
  const {
    data: previousMeasurement,
    isLoading: isLoadingPrevious,
    error: previousError,
  } = useQuery({
    queryKey: ['latestWeight'],
    queryFn: async () => {
      const response = await progressApi.getLatestWeight();
      return response;
    },
  });

  // Measurement logging mutation
  const { mutateAsync: logMeasurement, isPending: isLoggingMeasurement } = useLogMeasurementMutation();

  const handleSubmit = async (data: Record<string, any>) => {
    // Convert form data to WeightLogData format
    const measurementData: WeightLogData = {
      weight: data.weight,
      bodyFat: data.bodyFat || undefined,
      measurements: data.chest || data.waist || data.hips || data.leftArm || data.rightArm || data.leftThigh || data.rightThigh
        ? {
            chest: data.chest || undefined,
            waist: data.waist || undefined,
            hips: data.hips || undefined,
            leftArm: data.leftArm || undefined,
            rightArm: data.rightArm || undefined,
            leftThigh: data.leftThigh || undefined,
            rightThigh: data.rightThigh || undefined,
          }
        : undefined,
      timestamp: new Date().toISOString(),
    };

    await logMeasurement(measurementData);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your weight and body measurements</p>
        </div>
      </div>

      {/* Error States */}
      {previousError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load previous measurement. This is optional - you can still log your measurement.</AlertDescription>
        </Alert>
      )}

      {/* Measurement Logger */}
      <MeasurementLogger
        previousMeasurement={previousMeasurement}
        isLoadingPrevious={isLoadingPrevious}
        isLoading={isLoggingMeasurement}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default Progress;
