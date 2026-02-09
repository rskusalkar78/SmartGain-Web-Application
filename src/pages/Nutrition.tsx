import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { nutritionApi } from '@/api/endpoints/nutrition';
import { dashboardApi } from '@/api/endpoints/dashboard';
import { MealLogger } from '@/components/features/MealLogger';
import { useLogMealMutation } from '@/hooks/useMealLogging';
import { MealLogData, MealLog } from '@/api/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function Nutrition() {
  const [today] = useState(new Date().toISOString().split('T')[0]);

  // Fetch dashboard data for daily calorie info
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.getDashboard();
      return response;
    },
  });

  // Fetch today's meal logs
  const {
    data: mealLogs = [],
    isLoading: isMealLogsLoading,
    error: mealLogsError,
  } = useQuery({
    queryKey: ['mealLogs', today],
    queryFn: async () => {
      const response = await nutritionApi.getMealLogs(today);
      return response;
    },
  });

  // Meal logging mutation
  const { mutateAsync: logMeal, isPending: isLoggingMeal } = useLogMealMutation();

  // Calculate totals from meal logs
  const calorieTotal = mealLogs.reduce((sum, meal) => sum + meal.calories, 0);
  const proteinTotal = mealLogs.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const carbsTotal = mealLogs.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const fatsTotal = mealLogs.reduce((sum, meal) => sum + (meal.fats || 0), 0);

  const dailyCalorieTarget = dashboardData?.user?.dailyCalorieTarget || 2500;
  const dailyCalorieConsumed = dashboardData?.todayStats?.caloriesConsumed || calorieTotal;

  const handleSubmit = async (data: MealLogData) => {
    // Add timestamp to the meal log data
    const mealDataWithTimestamp: MealLogData = {
      ...data,
      timestamp: new Date().toISOString(),
    };

    await logMeal(mealDataWithTimestamp);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nutrition Tracking</h1>
          <p className="text-gray-600">Log your meals and monitor daily intake</p>
        </div>
      </div>

      {/* Error States */}
      {dashboardError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
        </Alert>
      )}

      {mealLogsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load meal logs. Please try again.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - MealLogger Form */}
        <div className="lg:col-span-2">
          <MealLogger
            dailyCalorieTotal={dailyCalorieConsumed}
            dailyCalorieTarget={dailyCalorieTarget}
            isLoading={isLoggingMeal}
            onSubmit={handleSubmit}
          />
        </div>

        {/* Sidebar - Daily Summary */}
        <div className="space-y-6">
          {/* Daily Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>{today}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {isDashboardLoading ? (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Calories</span>
                      <span className="font-semibold">
                        {dailyCalorieConsumed} / {dailyCalorieTarget}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Protein</span>
                      <span className="font-semibold">{proteinTotal.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Carbs</span>
                      <span className="font-semibold">{carbsTotal.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fat</span>
                      <span className="font-semibold">{fatsTotal.toFixed(1)}g</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Meals Card */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
              <CardDescription>{mealLogs.length} meals today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {isMealLogsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : mealLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No meals logged yet. Start by adding your first meal!</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {mealLogs.map((meal: MealLog) => (
                    <div key={meal.id} className="flex justify-between items-start border-b pb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{meal.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {meal.mealType}
                          </Badge>
                          <span className="text-xs text-gray-600">{meal.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
