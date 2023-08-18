const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    content : {type:String,trim:true},
    chat : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat", 
    },
    seenBy : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]
},
{
    timestamps : true
}
);

const messageModel = new mongoose.model("Message",messageSchema);

module.exports = messageModel;