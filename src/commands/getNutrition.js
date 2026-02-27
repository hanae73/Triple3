// src/commands/getNutrition.js
import nutritionData from "../data/nutrition.js";

export function getNutritionById(recipeId) {
  return nutritionData[recipeId] || null;
}

export function formatNutritionLabel(recipeId) {
  const data = nutritionData[recipeId];

  if (!data) {
    return "Nutrition data not found.";
  }

  return `
Calories: ${data.calories} kcal
Protein: ${data.protein} g
Carbs: ${data.carbs} g
Fat: ${data.fat} g
Fiber: ${data.fiber} g
`;
}