// Import dotenv
require("dotenv").config();
// Import npmlog
const log = require("npmlog");
// Import knex
const knex = require("knex")({
  client: "cockroachdb",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: true
  },
});

try {
  async function initTable() {
    // Create a table when the table does not exist
    await knex.schema.hasTable("users").then(async (exists) => {
      if (!exists) {
        await knex.schema.createTable("users", (table) => {
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
          table.increments("serverId")
            .primary();
          // Create commandSettings column
          table.json("commandSettings");
          // Create roomSettings column
          table.json("roomSettings");
        });
      }
    });
    
    // Create a table when the table does not exist
    await knex.schema.hasTable("playerShop").then(async (exists) => {
      if (!exists) {
        // Create a table when the table does not exist
        await knex.schema.createTable("playerShop", (table) => {
          // Create items ID
          table.increments("itemId")
            .primary();
          // Create item name
          table.string("itemName");
          // Create item emoji
          table.string("itemEmoji");
          // Create item description
          table.string("itemDescription");
          // Create item price
          table.integer("itemPrice");
          // Create item in stock
          table.integer("itemInStock");
          // Create item sellers
          table.json("itemSeller");
        });
      }
    });
    
    // Create a table when the table does not exist
    await knex.schema.hasTable("officialShop").then(async (exists) => {
      if (!exists) {
        // Create a table when the table does not exist
        await knex.schema.createTable("officialShop", (table) => {
          // Create items ID
          table.increments("itemId")
            .primary();
          // Create item name
          table.string("itemName");
          // Create item emoji
          table.string("itemEmoji");
          // Create item description
          table.string("itemDescription");
          // Create item price
          table.integer("itemPrice");
        });
      }
    });
  }
  initTable().then();
} catch (e) {
  log.error(e);
  process.exit(1);
}

// Export knex
module.exports = knex;
