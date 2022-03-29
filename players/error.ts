import { Queue } from "discord-player";

export default {
  name: "error",
  description: "Triggered when an error occurs.",
  run(queue: Queue, error: Error): void {
    throw error;
  },
};
