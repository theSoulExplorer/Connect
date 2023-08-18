const express = require("express");
const { register,login,allUsers } = require("../controllers/userController");
const protect = require("../middleware/auth");

const userRoutes = express.Router();

userRoutes.post("/register",register);
userRoutes.post("/login",login);
userRoutes.get("/",protect,allUsers);

module.exports = userRoutes;