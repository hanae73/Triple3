const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voicetimer')
    .setDescription('Starts a timer and plays a sound in your voice channel.')
    .addIntegerOption(option =>
      option.setName('minutes')
        .setDescription('Minutes for the timer')
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Seconds for the timer')
        .setRequired(false)
    ),

  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes') || 0;
    const seconds = interaction.options.getInteger('seconds') || 0;
    const totalMs = (minutes * 60 + seconds) * 1000;

    if (totalMs <= 0) {
      return interaction.reply('Please enter a valid time greater than 0.');
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply('You must be in a voice channel to use this command.');
    }

    await interaction.reply(`⏱️ Timer started for **${minutes}m ${seconds}s**! I’ll play a sound when it ends.`);

    setTimeout(() => {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const player = createAudioPlayer();
      const filePath = path.join(__dirname, '../helpers/sounds/timersound.mp4');
      const resource = createAudioResource(filePath);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      interaction.followUp('⏰ **Time’s up! Playing sound in your voice channel.**');
    }, totalMs);
  }
};