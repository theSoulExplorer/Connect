const express = require("express");
const protect = require("../middleware/auth");
const { accessChat, fetchChat } = require("../controllers/chatController");

const chatRoutes = express.Router();

chatRoutes.post("/",protect,accessChat);
chatRoutes.get("/",protect,fetchChat);

module.exports = chatRoutes;