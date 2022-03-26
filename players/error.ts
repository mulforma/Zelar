import log from "npmlog";
import { Queue } from "discord-player";

export default {
  name: "error",
  description: "Triggered when an error occurs.",
  run(queue: Queue, error: Error): void {
    log.error("Error!", error.message);
  },
};
