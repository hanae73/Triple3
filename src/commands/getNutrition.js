import { SlashCommandBuilder } from "discord.js";
import nutrition from "../helpers/nutrition.js";
//comment check! 

// Normalize user input to match nutrition keys
function normalizeRecipeName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "") // remove punctuation
    .replace(/\s+/g, "_")        // spaces → underscores
    .trim();
}

export default {
  data: new SlashCommandBuilder()
    .setName("nutrition")
    .setDescription("Get nutrition info for a recipe")
    .addStringOption(option =>
      option
        .setName("recipe")
        .setDescription("Enter a recipe name")
        .setRequired(true)
    ),

  async execute(interaction) {
    const rawInput = interaction.options.getString("recipe");
    const key = normalizeRecipeName(rawInput);

    if (!nutrition[key]) {
      return interaction.reply(
        `I couldn't find nutrition info for **${rawInput}**. Try typing the recipe name more clearly.`
      );
    }

    const info = nutrition[key];

    await interaction.reply(
      `**Nutrition for ${rawInput}:**\n` +
      `Calories: ${info.calories}\n` +
      `Protein: ${info.protein}\n` +
      `Carbs: ${info.carbs}\n` +
      `Fat: ${info.fat}`
    );
  },
};
