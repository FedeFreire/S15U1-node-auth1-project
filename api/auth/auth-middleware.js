const db = require("../../data/db-config.js");
const bcrypt = require("bcryptjs");
const Users = require("../users/users-model.js");

async function restricted(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next({ status: 401, message: "you shall not pass!" });
  }
}
async function checkUsernameFree(req, res, next) {
  try {
    const { username } = req.body;
    const users = await Users.findBy({ username });

    if (users.length > 0) {
      return res.status(422).json({ message: "username taken" });
    }

    next();
  } catch (err) {
    next(err);
  }
}

async function checkUsernameExists(req, res, next) {
  try {
    const { username, password } = req.body;
    const [user] = await Users.findBy({ username });

    if (user && password && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      next();
    } else {
      next({ status: 401, message: "Invalid Credentials" });
    }
  } catch (err) {
    next(err);
  }
}
async function checkPasswordLength(req, res, next) {
  try {
    if (!req.body.password || req.body.password.length < 3) {
      next({ status: 422, message: "password must be longer than 3 chars" });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
};
