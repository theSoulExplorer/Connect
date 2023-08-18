const generateToken = require("../config/generateToken");
const User = require("../models/userSchema");
const asyncHandler = require("express-async-handler");
const register = asyncHandler(async(req,res) => {
    const {name , username, password, publicKey} = req.body;
    if(!name || !username || !password || !publicKey){
        res.status(400);
        throw new Error("Please enter all the fields");
    }
    const userExists = await User.findOne({username});
    if(userExists){
        res.status(400);
        throw new Error("Username already exists");
    }
    const user = await User.create({
        name,
        username,
        password,
        publicKey
    });
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            username:user.username,
            status:user.status,
            token: generateToken(user._id),
            profilePhoto:user.profilePhoto
        });
    }
    else{
        res.status(400);
        throw new Error("Failed to register");
    }
});

const login = asyncHandler(async(req,res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name:user.name,
            username:user.username,
            status:user.status,
            token: generateToken(user._id),
            profilePhoto:user.profilePhoto
        })
    }
    else{
        res.status(401);
        throw new Error("Invalid username or password");
    }
});

const allUsers = asyncHandler(async(req,res) => {
    const keyword = req.query.search?{
        $or : [
            { name : {$regex : req.query.search,$options:"i"} },
            { username : {$regex : req.query.search,$options:"i"} }
        ]
    }:{};
    const users = await User.find(keyword).find({_id:{$ne:req.user._id}});
    res.send(users);
});

module.exports = {register,login,allUsers};