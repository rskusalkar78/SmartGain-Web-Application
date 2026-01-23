import { useState } from 'react';
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
  calculateDailyPlan,
  generateWorkoutPlan 
} from '@/lib/calculations';

type View = 'hero' | 'calculator' | 'results';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('hero');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  const handleGetStarted = () => {
    setCurrentView('calculator');
  };

  const handleCalculate = (data: UserData) => {
    setUserData(data);
    const calculatedResults = calculateDailyPlan(data);
    const plan = generateWorkoutPlan(data.workoutPreference, data.fitnessLevel);
    setResults(calculatedResults);
    setWorkoutPlan(plan);
    setCurrentView('results');
  };

  const handleRecalculate = (newData: Partial<UserData>) => {
    if (userData) {
      const updatedUserData = { ...userData, ...newData };
      setUserData(updatedUserData);
      const calculatedResults = calculateDailyPlan(updatedUserData);
      const plan = generateWorkoutPlan(updatedUserData.workoutPreference, updatedUserData.fitnessLevel);
      setResults(calculatedResults);
      setWorkoutPlan(plan);
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
        <Calculator onCalculate={handleCalculate} onBack={handleBackToHero} />
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
