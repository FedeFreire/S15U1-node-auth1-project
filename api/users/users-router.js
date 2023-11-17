const express = require("express");
const Users = require("./users-model.js");
const { restricted } = require("../auth/auth-middleware.js");

const router = express.Router();

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch(next);
});

module.exports = router;
