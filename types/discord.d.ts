import { Collection } from "discord.js";
import { Player } from "discord-player";
import { Knex } from "knex";

declare module "discord.js" {
  export interface Client {
    commands: Collection<unknown, any>;
    player: Player;
    db: Knex;
  }
}
