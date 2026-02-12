import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Nutrition } from "./pages/Nutrition";
import { Workout } from "./pages/Workout";
import { Progress } from "./pages/Progress";
import MealPlan from "./pages/MealPlan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Calculator route will be added when integrating with backend in task 10 */}
            
            {/* Protected Routes */}
            <Route path="/app/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/app/nutrition/log" element={
              <ProtectedRoute>
                <Nutrition />
              </ProtectedRoute>
            } />
            <Route path="/app/workout/log" element={
              <ProtectedRoute>
                <Workout />
              </ProtectedRoute>
            } />
            <Route path="/app/progress" element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            } />
            <Route path="/app/nutrition/plan" element={
              <ProtectedRoute>
                <MealPlan />
              </ProtectedRoute>
            } />
            
            {/* Additional protected routes will be added in future tasks */}
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
