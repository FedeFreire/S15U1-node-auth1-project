const db = require("../../data/db-config.js");

function find() {
  return db("users").select("user_id", "username");
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users").where({ user_id }).first("user_id", "username");
}
function add(user) {
  return db("users")
    .insert(user)
    .then(([user_id]) => {
      return findById(user_id);
    });
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
