// Import Knex
import { Knex } from "knex";
// Import ShopItemData
import { ShopItemData } from "../types/ShopItemData";

export const getItemData = (db: Knex, selector: string, value: string): Promise<Array<ShopItemData>> => {
  return db("globalItems").select("*").where(selector, value);
};
