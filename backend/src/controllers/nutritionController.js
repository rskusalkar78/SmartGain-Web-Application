import User from '../models/User.js';
import CalorieLog from '../models/CalorieLog.js';
import { generateMealPlan } from '../services/nutrition/macroCalculator.js';
import logger from '../utils/logger.js';

class NutritionController {
  /**
   * Get current meal plan for user
   * GET /api/v1/nutrition/meal-plan
   */
  async getMealPlan(req, res) {
    try {
      const userId = req.userId;
      
      // Fetch user data
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Check if user has calculations
      if (!user.calculations.targetCalories || !user.calculations.macroTargets) {
        return res.status(400).json({
          error: {
            code: 'CALCULATIONS_MISSING',
            message: 'User calculations not available. Please update profile to generate calculations.',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Generate meal plan
      const macroTargets = {
        totalCalories: user.calculations.targetCalories,
        macros: {
          protein: { grams: user.calculations.macroTargets.protein },
          carbs: { grams: user.calculations.macroTargets.carbs },
          fats: { grams: user.calculations.macroTargets.fat }
        }
      };
      
      const mealPlan = generateMealPlan(
        macroTargets,
        user.profile.dietaryPreferences || ['vegetarian', 'non-vegetarian'],
        4 // Default 4 meals per day
      );
      
      res.status(200).json({
        success: true,
        data: {
          mealPlan,
          userPreferences: user.profile.dietaryPreferences
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'MEAL_PLAN_GENERATION_FAILED',
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}

export default new NutritionController();

  /**
   * Log daily calorie intake
   * POST /api/v1/nutrition/log
   */
  async logCalories(req, res) {
    try {
      const userId = req.userId;
      const { date, meals, dailyTotals } = req.body;
      
      // Validate required fields
      if (!meals || !Array.isArray(meals) || meals.length === 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Meals array is required and must not be empty',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Fetch user to get target calories
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Calculate daily totals if not provided
      let calculatedDailyTotals = dailyTotals;
      if (!calculatedDailyTotals) {
        calculatedDailyTotals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
        
        meals.forEach(meal => {
          calculatedDailyTotals.calories += meal.totalCalories || 0;
          calculatedDailyTotals.protein += meal.totalProtein || 0;
          calculatedDailyTotals.carbs += meal.totalCarbs || 0;
          calculatedDailyTotals.fat += meal.totalFat || 0;
        });
      }
      
      // Check if target met
      const targetCalories = user.calculations.targetCalories || 0;
      const targetMet = targetCalories > 0 && calculatedDailyTotals.calories >= targetCalories * 0.95; // Within 5%
      
      // Create calorie log entry
      const calorieLog = new CalorieLog({
        userId,
        date: date ? new Date(date) : new Date(),
        meals,
        dailyTotals: calculatedDailyTotals,
        targetMet
      });
      
      await calorieLog.save();
      
      logger.info('Calorie log created', {
        userId,
        date: calorieLog.date,
        totalCalories: calculatedDailyTotals.calories,
        targetMet
      });
      
      res.status(201).json({
        success: true,
        message: 'Calorie log created successfully',
        data: {
          calorieLog: {
            id: calorieLog._id,
            date: calorieLog.date,
            meals: calorieLog.meals,
            dailyTotals: calorieLog.dailyTotals,
            targetMet: calorieLog.targetMet
          }
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to log calories', {
        userId: req.userId,
        error: error.message
      });
      
      let statusCode = 500;
      let errorCode = 'CALORIE_LOG_FAILED';
      
      if (error.name === 'ValidationError') {
        statusCode = 400;
        errorCode = 'VALIDATION_ERROR';
      }
      
      res.status(statusCode).json({
        error: {
          code: errorCode,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
