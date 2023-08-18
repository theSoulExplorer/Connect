const Chat = require("../models/chatSchema");
const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");


// accessChat
const accessChat = asyncHandler(async(req,res) => {
    const { userId } = req.body;
    if(!userId){
        console.log("userId not present");
        return res.sendStatus(400);
    }
    let isChat = await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users","-password").populate("latestMessage");

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name username profilePhoto status"
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        let chatData = {
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id:createdChat._id}).populate("users","-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

// fetchChat
const fetchChat = asyncHandler(async(req,res) => {
    try {
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt : -1})
        .then(async(result) => {
            result = await User.populate(result,{
                path:"latestMessage.sender",
                select:"name username profilePhoto status"
            });
            res.status(200).send(result);
        });
    } catch (error) {
        res.status(400);
        throw new Error(`error : ${error.message}`);
    }
});

module.exports = {accessChat,fetchChat};