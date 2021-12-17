const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const User = require("../models/user");

const { validationResult } = require("express-validator");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "unable to save user data or user exists",
      });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
    });
  }

  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user email not found...",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email & password do not match",
      });
    }

    // token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);

    // cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // res
    const { _id, name, email, role } = user;
    return res.status(200).json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "user signout success",
  });
};

// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

// custom middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.auth._id == req.profile._id;

  if (!checker) {
    return res.status(403).json({
      error: "access denied...",
    });
  }

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "not admin, access denied...",
    });
  }

  next();
};
