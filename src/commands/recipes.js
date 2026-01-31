
import { SlashCommandBuilder } from "discord.js";
//no updates
const recipes = [
  "Veggie & Egg Fried Rice",
  "One-Pan Quesadilla (or wrap melt)",
  "Garlic Butter (or Olive Oil) Pasta",
  "Microwave Sweet Potato Bowl",
  "Quick Ramen" 
];

export default {
  data: new SlashCommandBuilder()
    .setName("recipes")
    .setDescription("Shows 5 recipe options"),

  async execute(interaction) {
    let message = "Here are 5 recipes you can choose from:\n\n";
    recipes.forEach((r, i) => {
      message += `${i + 1}. ${r}\n`;
    });

    message += "\nTell me which one you want by entering the recipe number.";

    await interaction.reply(message);
  }
};
