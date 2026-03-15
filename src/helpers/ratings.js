// helpers/ratings.js
import fs from "fs";
import path from "path";

const ratingsFile = path.resolve("./src/data/ratings.json");

if (!fs.existsSync(path.dirname(ratingsFile)))
  fs.mkdirSync(path.dirname(ratingsFile), { recursive: true });

if (!fs.existsSync(ratingsFile))
  fs.writeFileSync(ratingsFile, "{}");

export default {

  getAllRatings() {
    const data = fs.readFileSync(ratingsFile, "utf8");
    return JSON.parse(data || "{}");
  },

  saveAllRatings(ratings) {
    fs.writeFileSync(ratingsFile, JSON.stringify(ratings, null, 2));
  },

  getUserRating(recipeId, userId) {
    const ratings = this.getAllRatings();
    return ratings[recipeId]?.[userId] || null;
  },

  setUserRating(recipeId, userId, rating, review = "") {
    const ratings = this.getAllRatings();

    if (!ratings[recipeId]) ratings[recipeId] = {};

    ratings[recipeId][userId] = {
      rating,
      review
    };

    this.saveAllRatings(ratings);
  },

  getAverageRating(recipeId) {
    const ratings = this.getAllRatings();
    const recipeRatings = ratings[recipeId];
    if (!recipeRatings) return 0;

    const values = Object.values(recipeRatings).map(r => r.rating);

    if (values.length === 0) return 0;

    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }
};