import log from "npmlog";
import { Queue } from "discord-player";

export default {
  name: "connectionError",
  description: "Triggered when an connection error occurs.",
  run(queue: Queue, error: Error): void {
    log.error("Error!", error.message);
  },
};
