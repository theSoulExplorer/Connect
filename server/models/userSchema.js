const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name : {type:String,required:true},
    username : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    status : {
        type:String,
        default:"Hey! I am using Connect.",
        trim:true,
    },
    profilePhoto : {type:String,default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"},
    publicKey : {type:String},
},
{
    timestamps : true
}
);

userSchema.methods.matchPassword = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password);
}

userSchema.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});
const userModel = new mongoose.model("User",userSchema);

module.exports = userModel;