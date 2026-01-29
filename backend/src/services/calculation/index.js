/**
 * Calculation Service Module
 * Exports all calculation-related functions for the SmartGain backend
 */

import {
  calculateBMR,
  calculateBMRWithBreakdown,
  validateBMRInput,
} from './bmrCalculator.js';

export {
  // BMR Calculations
  calculateBMR,
  calculateBMRWithBreakdown,
  validateBMRInput,
};
