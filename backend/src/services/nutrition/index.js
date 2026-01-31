/**
 * Nutrition Intelligence Service Module
 * Exports all nutrition-related functions for the SmartGain backend
 */

import {
  lookupFood,
  searchFoods,
  getFoodsByCategory,
  calculateFoodMacros,
  calculateMealMacros,
  getAllFoods,
  getDBStats,
  FOOD_DATABASE,
  validateFoodLookup
} from './nutritionDatabase.js';

export {
  // Food Database
  lookupFood,
  searchFoods,
  getFoodsByCategory,
  calculateFoodMacros,
  calculateMealMacros,
  getAllFoods,
  getDBStats,
  FOOD_DATABASE,
  validateFoodLookup
};
