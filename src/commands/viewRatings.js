// commands/viewRatings.js
import { SlashCommandBuilder } from "discord.js";
import recipes from "../helpers/recipes.js";
import ratingsHelper from "../helpers/ratings.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ratings")
    .setDescription("Check the average rating of a recipe")
    .addStringOption(option =>
      option
        .setName("recipe")
        .setDescription("Select a recipe to see its rating")
        .setRequired(true)
        .addChoices(
          ...Object.entries(recipes).map(([id, recipe]) => ({
            name: recipe.name,
            value: id
          }))
        )
    ),

  async execute(interaction) {
    const recipeId = interaction.options.getString("recipe");
    const recipe = recipes[recipeId];

    if (!recipe) {
      return interaction.reply({
        content: "❌ Recipe not found.",
        ephemeral: true
      });
    }

    const average = ratingsHelper.getAverageRating(recipeId);
    const ratings = ratingsHelper.getAllRatings()[recipeId] || {};
    const totalRatings = Object.keys(ratings).length;

    // Generate star visualization (⭐ filled, ☆ empty)
    const roundedAvg = Math.round(average); // round to nearest integer for stars
    const stars = Array.from({ length: 5 }, (_, i) =>
      i < roundedAvg ? "⭐" : "☆"
    ).join("");

    await interaction.reply({
      content: `
🍽 **${recipe.name}**

Average Rating: ${stars} (${average.toFixed(1)} / 5)  
Based on ${totalRatings} rating${totalRatings !== 1 ? "s" : ""}.
      `,
      ephemeral: false
    });
  }
};