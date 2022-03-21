"use strict";
const log = require("npmlog");
module.exports = {
    name: "error",
    description: "Triggered when an error occurs.",
    async run(queue, error) {
        log.error(`Error! ${error.message}`);
    },
};
