module.exports = (db, selector, value) => {
  return db.select("*").from("globalItems").where(selector, value).first();
};
