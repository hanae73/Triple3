import { SlashCommandBuilder } from "discord.js";
import recipesObj from "../helpers/recipes.js";
import { setUserRecipe } from "../state.js";

const recipesArray = [
  null,
  ...Object.values(recipesObj)
];

export default {
  data: new SlashCommandBuilder()
    .setName("pick")
    .setDescription("Select a recipe by number")
    .addIntegerOption(option =>
      option
        .setName("number")
        .setDescription("The recipe number")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(recipesArray.length - 1)
    ),

  async execute(interaction) {
    const choice = interaction.options.getInteger("number");
    const recipe = recipesArray[choice];

    if (!recipe) {
      return interaction.reply("❌ Invalid recipe number. Please pick a valid recipe number.");
    }

    setUserRecipe(interaction.user.id, choice);

    // Number the instructions dynamically
    const numberedInstructions = recipe.instructions
      .map((step, index) => `${index + 1}. ${step}`)
      .join("\n");

    let response = `🍽 **${recipe.name}**\n\n`;

    response += `🌍 **Cuisine:** ${recipe.typeOfCuisine}\n`;
    response += `⏱ **Cook Time:** ${recipe.cookTime}\n`;
    response += `👤 **Servings:** ${recipe.servings}\n\n`;

    response += "**🧾 Ingredients:**\n";
    recipe.ingredients.forEach(i => {
      response += `• ${i}\n`;
    });

    response += `\n**👨‍🍳 Instructions:**\n${numberedInstructions}\n`;

    if (recipe.video) {
      response += `\n🎥 **Video Tutorial:**\n${recipe.video}\n`;
    }

    response += "\n⚠️ **If you have ONE of the following allergens:**\n";
    response += "**egg, dairy, gluten, soy**\n";
    response += "Use the `/allergen` command to receive an alternative recipe.";

    await interaction.reply({
      content: response,
      allowedMentions: { parse: [] },
      flags: 1 << 2
    });
  },
};