// Import dotenv
require("dotenv").config();
// Import npmlog
const log = require("npmlog");
// Import knex
const knex = require("knex")({
  client: "cockroachdb", // Change to "pg" for PostgreSQL
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: true,
  },
});

async function initTable() {
  // Create a table when the table does not exist
  await knex.schema.hasTable("user").then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable("user", (table) => {
        // Create server ID
        table.integer("serverId");
        // Create user ID
        table.increments("userId");
        // Create coin column
        table.integer("coin");
        // Create xp column
        table.integer("xp");
        // Create level column
        table.integer("level");
        // Create jobs column
        table.string("jobs");
        // Create timeout column
        table.json("timeout");
        // Create inventory column
        table.json("inventory");
      });
    }
  });

  // Create a table when the table does not exist
  await knex.schema.hasTable("server").then(async (exists) => {
    if (!exists) {
      await knex.schema.createTable("server", (table) => {
        // Create server ID
        table.increments("serverId").primary();
        // Create commandSettings column
        table.json("commandSettings");
        // Create roomSettings column
        table.json("roomSettings");
      });
    }
  });

  // Create a table when the table does not exist
  await knex.schema.hasTable("officialShop").then(async (exists) => {
    if (!exists) {
      // Create a table when the table does not exist
      await knex.schema.createTable("officialShop", (table) => {
        // Create items ID
        table.increments("itemId").primary();
        // Create item name
        table.string("itemName");
        // Create item emoji
        table.string("itemEmoji");
        // Create item description
        table.string("itemDescription");
        // Create item price
        table.integer("itemPrice");
        // Create item type
        table.string("itemType");
      });
    }
  });

  // Create a table when the table does not exist
  await knex.schema.hasTable("globalItems").then(async (exists) => {
    if (!exists) {
      // Create a table when the table does not exist
      await knex.schema.createTable("globalItems", (table) => {
        // Create items ID
        table.increments("itemId").primary();
        // Create item name
        table.string("itemName");
        // Create item emoji
        table.string("itemEmoji");
        // Create item description
        table.string("itemDescription");
        // Add item type
        table.string("itemType");
        // Add item rarity
        table.string("itemRarity");
        // Add item price
        table.integer("price");
        // Add item usable
        table.boolean("usable");
        // Add item sellable
        table.boolean("sellable");
      });
    }
  });
}

try {
  initTable().then();
} catch (e) {
  log.error(e);
  process.exit(1);
}

// Export knex
module.exports = knex;
