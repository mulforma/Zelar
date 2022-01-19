module.exports = {
    name: "trackStart",
    description: "Triggered when a track starts playing",
    async run (queue, track) {
        if(queue.repeatMode !== 0) return;
        await queue.metadata.channel.send({
            content: `[🎧] Playing ${track.title}`
        });
    },
};
