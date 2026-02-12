import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { progressApi } from '@/api/endpoints/progress';
import { nutritionApi } from '@/api/endpoints/nutrition';
import { workoutApi } from '@/api/endpoints/workout';
import { MeasurementLogger } from '@/components/features/MeasurementLogger';
import { useLogMeasurementMutation } from '@/hooks/useMeasurementLogging';
import { WeightLogData, DateRangeParams } from '@/api/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TimeRangeSelector, TimeRange } from '@/components/features/TimeRangeSelector';
import { WeightChart } from '@/components/features/charts/WeightChart';
import { CalorieChart } from '@/components/features/charts/CalorieChart';
import { WorkoutChart } from '@/components/features/charts/WorkoutChart';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { subDays } from 'date-fns';

export function Progress() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  // Calculate start date based on time range
  const getDateRangeParams = (range: TimeRange): DateRangeParams => {
    // If 'all', we don't send a start date
    if (range === 'all') return { range: 'all' };

    // For specific ranges, we can pass the range parameter directly if the API supports it
    // The updated API client handles object params correctly
    return { range };
  };

  const dateParams = getDateRangeParams(timeRange);

  // Fetch weight logs
  const {
    data: weightLogs,
    isLoading: isLoadingWeight
  } = useQuery({
    queryKey: ['weightLogs', timeRange],
    queryFn: () => progressApi.getWeightLogs(dateParams),
  });

  // Fetch meal logs
  const {
    data: mealLogs,
    isLoading: isLoadingMeals
  } = useQuery({
    queryKey: ['mealLogs', timeRange],
    queryFn: () => nutritionApi.getMealLogs(dateParams),
  });

  // Fetch workout logs
  const {
    data: workoutLogs,
    isLoading: isLoadingWorkouts
  } = useQuery({
    queryKey: ['workoutLogs', timeRange],
    queryFn: () => workoutApi.getWorkoutLogs(dateParams),
  });

  // Fetch workout plan for completion rate calculation
  const {
    data: workoutPlan,
    isLoading: isLoadingWorkoutPlan
  } = useQuery({
    queryKey: ['workoutPlan'],
    queryFn: () => workoutApi.getWorkoutPlan(),
    // Don't fail the whole page if workout plan doesn't exist
    retry: false,
  });

  // Fetch latest weight for comparison (for the logger)
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
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-gray-600">Monitor your weight, nutrition, and workouts over time</p>
        </div>
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeightChart data={weightLogs || []} isLoading={isLoadingWeight} />
            <CalorieChart
              data={mealLogs || []}
              calorieTarget={user?.goals?.dailyCalories || 2500}
              isLoading={isLoadingMeals}
            />
          </div>
          <WorkoutChart 
            data={workoutLogs || []} 
            workoutPlan={workoutPlan}
            isLoading={isLoadingWorkouts || isLoadingWorkoutPlan} 
          />
        </TabsContent>

        <TabsContent value="weight">
          <WeightChart data={weightLogs || []} isLoading={isLoadingWeight} />
        </TabsContent>

        <TabsContent value="nutrition">
          <CalorieChart
            data={mealLogs || []}
            calorieTarget={user?.goals?.dailyCalories || 2500}
            isLoading={isLoadingMeals}
          />
        </TabsContent>

        <TabsContent value="workouts">
          <WorkoutChart 
            data={workoutLogs || []} 
            workoutPlan={workoutPlan}
            isLoading={isLoadingWorkouts || isLoadingWorkoutPlan} 
          />
        </TabsContent>
      </Tabs>

      {/* Measurement Logger Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Log Measurements</h2>

        {/* Error States */}
        {previousError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load previous measurement. This is optional - you can still log your measurement.</AlertDescription>
          </Alert>
        )}

        <MeasurementLogger
          previousMeasurement={previousMeasurement}
          isLoadingPrevious={isLoadingPrevious}
          isLoading={isLoggingMeasurement}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default Progress;
