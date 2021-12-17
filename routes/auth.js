const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

const { signup, signin, signout, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name", "name should be at least three chars...").isLength({
      min: 3,
    }),
    check("email", "email required...").isEmail(),
    check("password", "password should be at least three chars...").isLength({
      min: 3,
    }),
  ],
  signup
);
router.post(
  "/signin",
  [
    check("email", "email required...").isEmail(),
    check("password", "password required...").isLength({
      min: 1,
    }),
  ],
  signin
);
router.get("/signout", signout);

// testing
router.get("/test", isSignedIn, (req, res) =>
  res.status(200).json({
    success: true,
    auth: req.auth,
  })
);

module.exports = router;
