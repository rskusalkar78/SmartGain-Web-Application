/**
 * Calculation Service Module
 * Exports all calculation-related functions for the SmartGain backend
 */

import {
  calculateBMR,
  calculateBMRWithBreakdown,
  validateBMRInput,
} from './bmrCalculator.js';

import {
  calculateTDEE,
  calculateWeightGainCalories,
  calculateTotalCalorieTarget,
  calculateCompleteCaloriePlan,
  validateCaloriePlan,
  validateTDEEInput,
  ACTIVITY_MULTIPLIERS,
  CALORIE_SURPLUS_BY_INTENSITY
} from './tdeeCalculator.js';

export {
  // BMR Calculations
  calculateBMR,
  calculateBMRWithBreakdown,
  validateBMRInput,
  
  // TDEE and Weight Gain Calculations
  calculateTDEE,
  calculateWeightGainCalories,
  calculateTotalCalorieTarget,
  calculateCompleteCaloriePlan,
  validateCaloriePlan,
  validateTDEEInput,
  ACTIVITY_MULTIPLIERS,
  CALORIE_SURPLUS_BY_INTENSITY
};
