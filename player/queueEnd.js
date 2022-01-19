module.exports = {
    name: "queueEnd",
    description: "Triggered when a queue ends.",
    async run (queue) {
        await queue.metadata.channel.send({
            content: 'Queue ended.'
        });
    },
};
