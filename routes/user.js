const express = require("express");
const routes = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getUserById,
  getUser,
  getUsers,
  updateUser,
} = require("../controllers/user");

routes.param("userId", getUserById);

routes.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
routes.get("/users", getUsers);

routes.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = routes;
