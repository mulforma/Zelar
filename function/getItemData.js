module.exports = (db, selector) => {
  return db.select("*").from("globalItems").where(selector).first();
};
