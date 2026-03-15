import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
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

    let existing = ratingsHelper.getUserRating(recipeId, userId);
    let userRating = existing?.rating || 0;

    const baseContent = (recipeName) => `
## ⭐ Rate ${recipeName}

Please choose your rating below:

`;

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

    const replyMessage = await interaction.reply({
      content: baseContent(recipe.name),
      components: [generateStarButtons(userRating)],
      ephemeral: true,
      fetchReply: true
    });

    const collector = replyMessage.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10 * 60 * 1000
    });

    collector.on("collect", async buttonInteraction => {
      if (buttonInteraction.user.id !== userId) {
        return buttonInteraction.reply({
          content: "Only you can interact with this rating panel.",
          ephemeral: true
        });
      }

      const selectedStar = parseInt(buttonInteraction.customId.split("_")[1]);
      userRating = selectedStar;

      const modal = new ModalBuilder()
        .setCustomId(`review_${recipeId}_${selectedStar}`)
        .setTitle(`Review ${recipe.name}`);

      const reviewInput = new TextInputBuilder()
        .setCustomId("review_text")
        .setLabel("Leave a short review (optional)")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(300)
        .setPlaceholder("What did you think of this recipe?");

      const row = new ActionRowBuilder().addComponents(reviewInput);
      modal.addComponents(row);

      await buttonInteraction.showModal(modal);

      try {
        const modalSubmit = await buttonInteraction.awaitModalSubmit({
          time: 5 * 60 * 1000,
          filter: i => i.user.id === userId
        });

        const reviewText = modalSubmit.fields.getTextInputValue("review_text");

        ratingsHelper.setUserRating(recipeId, userId, userRating, reviewText);

        await modalSubmit.deferUpdate();

        const steps = 5;
        const interval = 200;

        for (let step = 1; step <= steps; step++) {
          const flashLevel = Math.ceil((userRating / steps) * step);

          await interaction.editReply({
            content: `
## ✨ Rating Saved

Thanks for reviewing!

`,
            components: [generateStarButtons(userRating, flashLevel)]
          });

          await new Promise(resolve => setTimeout(resolve, interval));
        }

        await interaction.editReply({
          content: baseContent(recipe.name),
          components: [generateStarButtons(userRating)]
        });

      } catch (err) {
        console.error("Modal failed", err);
      }
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