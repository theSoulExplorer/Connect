const asyncHandler = require("express-async-handler");
const Message = require("../models/messageSchema");
const User = require("../models/userSchema");
const Chat = require("../models/chatSchema");
const sendMessage = asyncHandler(async (req,res) => {
    const {content,chatId} = req.body;
    if(!content || !chatId){
        console.log("Invalid Data passed in body");
        return res.sendStatus(400);
    }
    let newMessage = {
        sender : req.user._id,
        content : content,
        chat : chatId
    };
    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender","name profilePhoto");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:"chat.users",
            select:"name username profilePhoto"
        });
        
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message
        });
        res.status(200).send(message);
    } catch (error) {
        res.status(400);
        throw new Error(`Error : ${error}`);
    }
});
const allMessage = asyncHandler(async (req,res) => {
    try {
        const message = await Message.find({chat:req.params.chatId})
        .populate("sender","name profilePhoto username")
        .populate("chat")
        .populate("seenBy");
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {sendMessage,allMessage};