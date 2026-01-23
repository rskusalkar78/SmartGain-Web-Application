import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserData, CalculationResult } from '@/lib/calculations';
import { useState } from 'react';

interface EnhancedWarningProps {
  userData: UserData;
  results: CalculationResult;
  onMakeSafer: (newTimeframe: number) => void;
}

export function EnhancedWarning({ userData, results, onMakeSafer }: EnhancedWarningProps) {
  const [showPreview, setShowPreview] = useState(false);
  
  if (!results.warning) return null;
  
  // Calculate safer alternative
  const targetGainRate = 0.4; // kg per week (safe rate)
  const saferTimeframe = Math.ceil(userData.targetWeightGain / targetGainRate);
  const saferWeeklyGain = userData.targetWeightGain / saferTimeframe;
  const saferDailySurplus = Math.round((userData.targetWeightGain * 7700) / (saferTimeframe * 7));
  
  const currentSurplus = results.calorieSurplus;
  const surplusReduction = currentSurplus - saferDailySurplus;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 p-5 rounded-xl bg-warning/10 border border-warning/30"
    >
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-medium text-warning mb-1">Aggressive Gain Rate Detected</p>
          <p className="text-sm text-muted-foreground">{results.warning}</p>
        </div>
      </div>
      
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 rounded-lg bg-background/50 border border-border"
          >
            <p className="text-sm font-medium mb-3">What changes with a safer plan:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">New timeline:</span>
                <span className="font-semibold text-accent">{saferTimeframe} weeks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Weekly gain:</span>
                <span className="font-semibold text-accent">{saferWeeklyGain.toFixed(2)} kg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Daily surplus:</span>
                <span className="font-semibold text-accent">{saferDailySurplus} kcal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Reduction:</span>
                <span className="font-semibold text-accent">-{surplusReduction} kcal/day</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          size="sm"
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => onMakeSafer(saferTimeframe)}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <Shield className="w-4 h-4 mr-2" />
          Make It Safer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-warning/50 text-warning hover:bg-warning/10"
        >
          Continue Anyway
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3">
        💡 We support your goals while prioritizing your health. Either choice is valid.
      </p>
    </motion.div>
  );
}
