const express = require("express");
const bodyParser = require("body-parser");
const User = require("../models/user");
const userRouter = express.Router();
const passport = require("passport");
const authenticate = require("../authenticate");
userRouter.use(bodyParser.json());

userRouter.get(
  "/",
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  async (req, res, next) => {
    await User.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => {
          next(err);
        }
      )

      .catch((err) => next(err));
  }
);

userRouter.post("/signup", (req, res, next) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 500;
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err, user) => {
          if (err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.json({ err: err });
            return;
          }
          passport.authenticate("local")(req, res, () => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ status: "Successful Registeration", success: true });
          });
        });
      }
    }
  );
});

userRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({ status: "Successful Login", token: token, success: true });
});

userRouter.get("/logout", (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  }
});

module.exports = userRouter;
