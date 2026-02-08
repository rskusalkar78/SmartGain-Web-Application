// SmartGain Frontend - Dashboard Data Hook
// React Query hook for fetching dashboard data

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { dashboardApi } from '@/api/endpoints/dashboard';
import { DashboardData } from '@/api/types';

/**
 * Query key factory for dashboard queries
 */
export const dashboardKeys = {
  all: ['dashboard'] as const,
  detail: () => [...dashboardKeys.all, 'detail'] as const,
};

/**
 * Hook to fetch dashboard data
 * Includes user profile, today's stats, weekly progress, and upcoming workouts
 * 
 * Features:
 * - Automatic refresh after 5 minutes of inactivity (Req 4.7)
 * - Background refetching on window focus (Req 12.5)
 * 
 * @returns React Query result with dashboard data
 */
export const useDashboard = () => {
  const lastActivityRef = useRef<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const query = useQuery<DashboardData>({
    queryKey: dashboardKeys.detail(),
    queryFn: dashboardApi.getDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: true, // Refetch when window regains focus (Req 12.5)
    retry: 2, // Retry failed requests twice
  });

  // Implement auto-refresh after 5 minutes of inactivity (Req 4.7)
  useEffect(() => {
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;
      
      // If inactive for 5 minutes, refetch data
      if (timeSinceLastActivity >= 5 * 60 * 1000) {
        query.refetch();
        lastActivityRef.current = now;
      }
    };

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, updateActivity);
    });

    // Check for inactivity every minute
    inactivityTimerRef.current = setInterval(checkInactivity, 60 * 1000);

    return () => {
      // Cleanup
      activityEvents.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      if (inactivityTimerRef.current) {
        clearInterval(inactivityTimerRef.current);
      }
    };
  }, [query]);

  return query;
};
