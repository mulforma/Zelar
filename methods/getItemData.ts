// Import Knex
import { Knex } from "knex";

export const getItemData = (db: Knex, selector: string, value: string): any => {
  return db("globalItems").select("*").where(selector, value).then();
};
