module.exports = {
  name: "botDisconnect",
  description: "Triggered when a bot disconnects from the voice channel",
  async run (queue) {
    await queue.metadata.channel.send({
      content: `The bot was dropped from the voice channel. The queue has been cleared.`
    });
  },
};
