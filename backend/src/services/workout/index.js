/**
 * Workout Service Module
 * Exports all workout-related functions for the SmartGain backend
 */

import {
  generateWeeklyPlan,
  getExercise,
  getAllExercises,
  getExercisesByCategory,
  getExercisesByMuscle,
  getSessionForDay,
  getWorkoutStats,
  validateWorkoutRequest,
  EXERCISE_DATABASE,
  BEGINNER_TEMPLATE,
  INTERMEDIATE_TEMPLATE,
  ADVANCED_TEMPLATE
} from './workoutEngine.js';

export {
  // Workout Planning
  generateWeeklyPlan,
  getSessionForDay,
  getWorkoutStats,
  
  // Exercise Lookup
  getExercise,
  getAllExercises,
  getExercisesByCategory,
  getExercisesByMuscle,
  
  // Validation
  validateWorkoutRequest,
  
  // Data
  EXERCISE_DATABASE,
  BEGINNER_TEMPLATE,
  INTERMEDIATE_TEMPLATE,
  ADVANCED_TEMPLATE
};
