
const userSessions = new Map();

export function setUserRecipe(userId, recipeNumber) {
  userSessions.set(userId, recipeNumber);
}

export function getUserRecipe(userId) {
  return userSessions.get(userId);
}

export function clearUserRecipe(userId) {
  userSessions.delete(userId);
} 
