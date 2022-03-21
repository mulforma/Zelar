export const getItemData = (db, selector, value) => {
    return db.select("*").from("globalItems").where(selector, value).then();
};
