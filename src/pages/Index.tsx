import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '@/components/Hero';
import { Calculator } from '@/components/Calculator';
import { Results } from '@/components/Results';
import { WhyDifferent } from '@/components/landing/WhyDifferent';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';
import { 
  UserData, 
  CalculationResult, 
  WorkoutPlan,
  generateWorkoutPlan 
} from '@/lib/calculations';
import { CalculatorResults } from '@/api/types';
import { useCalculator } from '@/hooks/useCalculator';
import { useAuth } from '@/hooks/useAuth';
import { userApi } from '@/api/endpoints';

type View = 'hero' | 'calculator' | 'results';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('hero');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  // Calculator mutation hook
  const calculatorMutation = useCalculator();
  
  // Auth hook
  const { isAuthenticated } = useAuth();
  
  // Navigation hook
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentView('calculator');
  };

  const handleCalculate = async (data: UserData) => {
    setUserData(data);
    
    try {
      // Call backend API for calculation
      const apiResults = await calculatorMutation.mutateAsync(data);
      
      // Convert API results to local CalculationResult format for Results component
      const calculatedResults: CalculationResult = {
        bmr: 0, // Not provided by API, can be calculated locally if needed
        tdee: 0, // Not provided by API, can be calculated locally if needed
        dailyCalories: apiResults.dailyCalories,
        weeklyCalories: apiResults.dailyCalories * 7,
        calorieSurplus: 0, // Not provided by API
        protein: apiResults.protein,
        carbs: apiResults.carbs,
        fats: apiResults.fats,
        proteinCalories: apiResults.protein * 4,
        carbCalories: apiResults.carbs * 4,
        fatCalories: apiResults.fats * 9,
        weeklyGain: data.targetWeightGain / data.timeframe,
        isHealthyRate: (data.targetWeightGain / data.timeframe) <= 0.5,
        warning: undefined,
      };
      
      const plan = generateWorkoutPlan(data.workoutPreference, data.fitnessLevel);
      setResults(calculatedResults);
      setWorkoutPlan(plan);
      
      // If user is authenticated, save results to profile
      if (isAuthenticated) {
        try {
          await userApi.updateProfile({
            goals: {
              currentWeight: data.currentWeight,
              targetWeight: data.currentWeight + data.targetWeightGain,
              weeklyGainGoal: data.targetWeightGain / data.timeframe,
              dailyCalories: apiResults.dailyCalories,
              dailyProtein: apiResults.protein,
              dailyCarbs: apiResults.carbs,
              dailyFats: apiResults.fats,
            },
          });
          
          // Redirect to dashboard after saving
          navigate('/app/dashboard');
          return;
        } catch (error) {
          console.error('Failed to save results to profile:', error);
          // Continue to show results even if save fails
        }
      }
      
      setCurrentView('results');
    } catch (error) {
      // Error is handled by the mutation, will be displayed in Calculator component
      console.error('Calculation failed:', error);
    }
  };

  const handleRecalculate = async (newData: Partial<UserData>) => {
    if (userData) {
      const updatedUserData = { ...userData, ...newData };
      setUserData(updatedUserData);
      
      try {
        const apiResults = await calculatorMutation.mutateAsync(updatedUserData);
        
        const calculatedResults: CalculationResult = {
          bmr: 0,
          tdee: 0,
          dailyCalories: apiResults.dailyCalories,
          weeklyCalories: apiResults.dailyCalories * 7,
          calorieSurplus: 0,
          protein: apiResults.protein,
          carbs: apiResults.carbs,
          fats: apiResults.fats,
          proteinCalories: apiResults.protein * 4,
          carbCalories: apiResults.carbs * 4,
          fatCalories: apiResults.fats * 9,
          weeklyGain: updatedUserData.targetWeightGain / updatedUserData.timeframe,
          isHealthyRate: (updatedUserData.targetWeightGain / updatedUserData.timeframe) <= 0.5,
          warning: undefined,
        };
        
        const plan = generateWorkoutPlan(updatedUserData.workoutPreference, updatedUserData.fitnessLevel);
        setResults(calculatedResults);
        setWorkoutPlan(plan);
      } catch (error) {
        console.error('Recalculation failed:', error);
      }
    }
  };

  const handleReset = () => {
    setCurrentView('hero');
    setUserData(null);
    setResults(null);
    setWorkoutPlan(null);
  };

  const handleBackToHero = () => {
    setCurrentView('hero');
  };

  return (
    <main className="dark min-h-screen bg-background">
      {currentView === 'hero' && (
        <>
          <Hero onGetStarted={handleGetStarted} />
          <WhyDifferent />
          <HowItWorks />
          <Testimonials />
          <Footer />
        </>
      )}
      {currentView === 'calculator' && (
        <Calculator 
          onCalculate={handleCalculate} 
          onBack={handleBackToHero}
          isLoading={calculatorMutation.isPending}
          error={calculatorMutation.error ? 'Failed to calculate. Please try again.' : null}
        />
      )}
      {currentView === 'results' && userData && results && workoutPlan && (
        <Results 
          userData={userData} 
          results={results} 
          workoutPlan={workoutPlan}
          onReset={handleReset}
          onRecalculate={handleRecalculate}
        />
      )}
    </main>
  );
};

export default Index;
