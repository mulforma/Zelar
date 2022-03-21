"use strict";
module.exports = {
    name: "trackAdd",
    description: "Triggered when a track is added to the queue.",
    async run(queue, track) {
        await queue.metadata.channel.send({
            content: `[🎧] **${track.title}** has been added to the queue.`,
        });
    },
};
