module.exports = {
  name: "channelEmpty",
  description: "Triggered when a channel is empty.",
  async run(queue) {
    await queue.metadata.channel.send({
      content: "Bot is drop because the channel is empty.",
    });
  },
};
