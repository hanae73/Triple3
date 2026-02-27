import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} from "discord.js";

import recipes from "../helpers/recipes.js";
import ratingsHelper from "../helpers/ratings.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rate")
    .setDescription("Rate a recipe from 1 to 5 stars")
    .setDMPermission(false)
    .addStringOption(option =>
      option
        .setName("recipe")
        .setDescription("Select a recipe to rate")
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
    const userId = interaction.user.id;

    let userRating = ratingsHelper.getUserRating(recipeId, userId) || 0;

    // Structured card layout
    const baseContent = (recipeName) => `
## ⭐ Rate ${recipeName}

Please choose your rating below:

`;

    // Generate star buttons
    const generateStarButtons = (selected = 0, flashLevel = 0, disabled = false) => {
      const row = new ActionRowBuilder();

      for (let i = 1; i <= 5; i++) {
        let label;

        if (flashLevel > 0) {
          label = i <= flashLevel ? "✨" : i <= selected ? "⭐" : "☆";
        } else {
          label = i <= selected ? "⭐" : "☆";
        }

        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`star_${i}`)
            .setLabel(label)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(disabled)
        );
      }

      return row;
    };

    // Send ephemeral rating panel
    const replyMessage = await interaction.reply({
      content: baseContent(recipe.name),
      components: [generateStarButtons(userRating)],
      ephemeral: true,
      fetchReply: true
    });

    const collector = replyMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10 * 60 * 1000 // 10 minutes
    });

    collector.on("collect", async buttonInteraction => {
      if (buttonInteraction.user.id !== userId) {
        return buttonInteraction.reply({
          content: "Only you can interact with this rating panel.",
          ephemeral: true
        });
      }

      // Prevent "This interaction failed"
      await buttonInteraction.deferUpdate();

      const selectedStar = parseInt(buttonInteraction.customId.split("_")[1]);
      userRating = selectedStar;

      ratingsHelper.setUserRating(recipeId, userId, userRating);

      // 1-second smooth animation (5 steps × 200ms)
      const steps = 5;
      const interval = 200;

      for (let step = 1; step <= steps; step++) {
        const flashLevel = Math.ceil((userRating / steps) * step);

        await interaction.editReply({
          content: `
## ✨ Rating Updating

Applying your selection...

`,
          components: [generateStarButtons(userRating, flashLevel)]
        });

        await new Promise(resolve => setTimeout(resolve, interval));
      }

      // Final settled stars
      await interaction.editReply({
        content: baseContent(recipe.name),
        components: [generateStarButtons(userRating)]
      });
    });

    collector.on("end", async () => {
      const disabledRow = generateStarButtons(userRating, 0, true);
      await interaction.editReply({
        content: baseContent(recipe.name),
        components: [disabledRow]
      });
    });
  }
};