import User from '../models/User.js';
import CalorieLog from '../models/CalorieLog.js';
import { generateUserMealPlan, calculateMealNutrition } from '../services/integration/nutritionIntegration.js';
import logger from '../utils/logger.js';

class NutritionController {
  /**
   * Get current meal plan for user
   * GET /api/v1/nutrition/meal-plan
   */
  async getMealPlan(req, res) {
    try {
      const userId = req.userId;
      const { mealsPerDay } = req.query;
      
      // Generate meal plan using integration
      const mealPlan = await generateUserMealPlan(userId, {
        mealsPerDay: mealsPerDay ? parseInt(mealsPerDay) : 4
      });
      
      res.status(200).json({
        success: true,
        data: mealPlan,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      let statusCode = 500;
      let errorCode = 'MEAL_PLAN_GENERATION_FAILED';
      
      if (error.message === 'User not found') {
        statusCode = 404;
        errorCode = 'USER_NOT_FOUND';
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
}

export default new NutritionController();
