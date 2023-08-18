const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.URI;

const connectDatabase = async() => {
    try{
        const connection = await mongoose.connect(uri,{
            useNewUrlParser : true,
            useUnifiedTopology:true,
        });
        console.log("Connection Established");
    }
    catch(err){
        console.log("Error Occured : ",err);
        process.exit();
    }
};

module.exports = connectDatabase;