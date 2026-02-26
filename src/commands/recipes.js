
import { SlashCommandBuilder } from "discord.js";

const recipes = [
  "Veggie & Egg Fried Rice",
  "One-Pan Quesadilla (or wrap melt)",
  "Garlic Butter (or Olive Oil) Pasta",
  "Microwave Sweet Potato Bowl",
  "Quick Ramen",
  "Peanut Butter Banana Toast",
  "Greek Yogurt Parfait",
  "Tuna Salad Wrap",
  "Caprese Sandwich",
  "Vegetable Soy Skillet",
  "Single-Serve Shakshuka",
  "Avocado Toast with Chili Flakes",
  "Microwave Mug Omelet",
  "Pesto Penne",
  "Black Bean Rice Bowl",
  "Chicken Hummus Wrap",
  "Masala Toast",
  "Cheesy Baked Potato",
  "Cold Sesame Noodles",
  "Simple Lentil Soup",
  "Kimchi Rice Bowl",
  "Banana Oat Pancakes",
  "Tomato & Egg Skillet",
  "Chocolate Mug Cake",
  "Chickpea Coconut Curry",
  "Spinach & Cheese Toast",
  "Yogurt Berry Bowl",
  "Mediterranean Chickpea Salad",
  "Egg & Cheese Breakfast Sandwich",
  "Rice and Beans Comfort Bowl",
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
