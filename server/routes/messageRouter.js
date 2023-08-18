const express = require("express");
const protect = require("../middleware/auth");
const { sendMessage, allMessage } = require("../controllers/messageController");

const messageRoutes = express.Router();

messageRoutes.post("/",protect,sendMessage);
messageRoutes.get("/:chatId",protect,allMessage);

module.exports = messageRoutes;