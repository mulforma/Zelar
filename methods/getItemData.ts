// Import Knex
import { Knex } from "knex";

exports = (db: Knex, selector: string, value: string) => {
  return db.select("*").from("globalItems").where(selector, value).then();
};
