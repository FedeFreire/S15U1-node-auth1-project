const express = require("express");
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("./auth-middleware.js");
const bcrypt = require("bcryptjs");
const router = express.Router();
const Users = require("../users/users-model.js");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const hash = bcrypt.hashSync(password, 8);
      const newUser = { username, password: hash };
      const result = await Users.add(newUser);

      res.status(201).json({
        user_id: result.user_id, 
        username: result.username,
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", checkUsernameExists, (req, res, next) => {
  res.json({
    message: `welcome ${req.session.user.username}`,
  });
});

router.get("/logout", async (req, res, next) => {
  if (req.session.user) {
    const { username } = req.session.user;
    req.session.destroy((err) => {
      if (err) {
        res.json({ message: `you can never leave ${username}!` });
      } else {
        res.set(
          "Set-Cookie",
          "chocolatechip=; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
        );
        res.json({ message: "logged out" });
      }
    });
  } else {
    res.json({ message: "no session" });
  }
});
module.exports = router;
