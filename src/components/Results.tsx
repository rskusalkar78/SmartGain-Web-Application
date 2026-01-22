import { motion } from 'framer-motion';
import { 
  Flame, Target, Utensils, Dumbbell, AlertTriangle, 
  TrendingUp, ArrowLeft, RotateCcw, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserData, CalculationResult, WorkoutPlan } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface ResultsProps {
  userData: UserData;
  results: CalculationResult;
  workoutPlan: WorkoutPlan;
  onReset: () => void;
}

export function Results({ userData, results, workoutPlan, onReset }: ResultsProps) {
  const macroData = [
    { 
      name: 'Protein', 
      grams: results.protein, 
      calories: results.proteinCalories,
      color: 'from-primary to-warning',
      percentage: Math.round((results.proteinCalories / results.dailyCalories) * 100)
    },
    { 
      name: 'Carbs', 
      grams: results.carbs, 
      calories: results.carbCalories,
      color: 'from-accent to-success',
      percentage: Math.round((results.carbCalories / results.dailyCalories) * 100)
    },
    { 
      name: 'Fats', 
      grams: results.fats, 
      calories: results.fatCalories,
      color: 'from-warning to-primary',
      percentage: Math.round((results.fatCalories / results.dailyCalories) * 100)
    },
  ];

  return (
    <section className="min-h-screen py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Button variant="ghost" onClick={onReset} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Over
          </Button>
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Your Personalized Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Based on your goals of gaining {userData.targetWeightGain}kg in {userData.timeframe} weeks
          </p>
        </motion.div>

        {/* Warning if applicable */}
        {results.warning && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
            <p className="text-sm">{results.warning}</p>
          </motion.div>
        )}

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 text-center glow-effect"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-warning flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-4xl font-bold font-display gradient-text mb-2">
              {results.dailyCalories.toLocaleString()}
            </div>
            <div className="text-muted-foreground">Daily Calories</div>
            <div className="mt-3 text-sm text-muted-foreground">
              +{results.calorieSurplus} surplus
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-success flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-accent-foreground" />
            </div>
            <div className="text-4xl font-bold font-display mb-2">
              {results.weeklyGain.toFixed(2)}kg
            </div>
            <div className="text-muted-foreground">Weekly Gain</div>
            <div className={cn(
              "mt-3 text-sm",
              results.isHealthyRate ? "text-accent" : "text-warning"
            )}>
              {results.isHealthyRate ? '✓ Healthy rate' : '⚠ Aggressive rate'}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div className="text-4xl font-bold font-display mb-2">
              {(userData.currentWeight + userData.targetWeightGain).toFixed(1)}kg
            </div>
            <div className="text-muted-foreground">Target Weight</div>
            <div className="mt-3 text-sm text-muted-foreground">
              From {userData.currentWeight}kg
            </div>
          </motion.div>
        </div>

        {/* TDEE Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6 mb-12"
        >
          <h3 className="text-xl font-semibold font-display mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Your Metabolic Profile
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Basal Metabolic Rate (BMR)</span>
                <span className="font-semibold">{results.bmr} kcal</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Total Daily Energy Expenditure</span>
                <span className="font-semibold">{results.tdee} kcal</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Required Daily Surplus</span>
                <span className="font-semibold text-primary">+{results.calorieSurplus} kcal</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-muted-foreground">Weekly Calorie Target</span>
                <span className="font-semibold">{results.weeklyCalories.toLocaleString()} kcal</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Macros Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-2xl p-6 mb-12"
        >
          <h3 className="text-xl font-semibold font-display mb-6 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-primary" />
            Daily Macro Breakdown
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {macroData.map((macro, index) => (
              <motion.div
                key={macro.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(macro.percentage / 100) * 352} 352`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{macro.percentage}%</span>
                  </div>
                </div>
                <div className="font-semibold text-lg">{macro.name}</div>
                <div className="text-muted-foreground">
                  {macro.grams}g • {macro.calories} kcal
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Workout Plan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold font-display flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                {workoutPlan.name}
              </h3>
              <p className="text-muted-foreground mt-1">{workoutPlan.description}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <span className="font-semibold">{workoutPlan.daysPerWeek}</span>
              <span>days/week</span>
            </div>
          </div>

          <div className="space-y-4">
            {workoutPlan.split.slice(0, 5).map((day, index) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200",
                  day.isRestDay 
                    ? "border-muted bg-muted/30" 
                    : "border-border hover:border-primary/50 cursor-pointer"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{day.day}</div>
                    <div className="text-sm text-muted-foreground">{day.focus}</div>
                  </div>
                  {!day.isRestDay && (
                    <div className="flex items-center text-muted-foreground">
                      <span className="text-sm mr-2">{day.exercises.length} exercises</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                {!day.isRestDay && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {day.exercises.slice(0, 3).map((exercise) => (
                      <span 
                        key={exercise.name}
                        className="px-2 py-1 rounded-md bg-muted text-xs"
                      >
                        {exercise.name}
                      </span>
                    ))}
                    {day.exercises.length > 3 && (
                      <span className="px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                        +{day.exercises.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30">
            <h4 className="font-semibold mb-2">Pro Tips</h4>
            <ul className="space-y-1">
              {workoutPlan.tips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <Button variant="hero" size="lg" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Calculate New Plan
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
