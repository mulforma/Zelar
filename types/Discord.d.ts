import { Collection } from "discord.js";
import { Player } from "discord-player";

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>;
    player: Player;
  }
}
