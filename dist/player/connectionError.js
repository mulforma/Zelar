"use strict";
const /**@type npmlog */ log = require("npmlog");
module.exports = {
    name: "connectionError",
    description: "Triggered when an connection error occurs.",
    async run(queue, error) {
        log.error(`Error! ${error.message}`);
    },
};
