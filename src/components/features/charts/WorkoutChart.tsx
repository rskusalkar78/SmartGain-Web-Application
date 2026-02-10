import { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutLog } from '@/api/types';
import { format, startOfDay, parseISO } from 'date-fns';

interface WorkoutChartProps {
    data: WorkoutLog[];
    isLoading?: boolean;
}

export function WorkoutChart({ data, isLoading }: WorkoutChartProps) {
    const chartData = useMemo(() => {
        // Group workout logs by day
        const dailyWorkouts = new Map<string, number>();

        data.forEach(log => {
            const dateKey = format(startOfDay(parseISO(log.timestamp)), 'yyyy-MM-dd');
            const currentCount = dailyWorkouts.get(dateKey) || 0;
            dailyWorkouts.set(dateKey, currentCount + 1);
        });

        // Convert to array and sort
        return Array.from(dailyWorkouts.entries())
            .map(([dateStr, count]) => ({
                date: format(parseISO(dateStr), 'MMM d'),
                fullDate: format(parseISO(dateStr), 'PPP'),
                workouts: count
            }))
            .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
    }, [data]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Workout Consistency</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Workout Consistency</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No workout data available for this period
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Workout Consistency</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: '#F3F4F6' }}
                            labelFormatter={(label, payload) => {
                                if (payload && payload.length > 0) {
                                    return payload[0].payload.fullDate;
                                }
                                return label;
                            }}
                        />
                        <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
