const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const connectDatabase = require("./config/database");
const userRoutes = require("./routes/userRouter");
const chatRoutes = require("./routes/chatRouter");
const messageRoutes = require("./routes/messageRouter");
const { notFound,errorHandler } = require("./middleware/errorMiddleware");
connectDatabase();
const app = express();
app.use(express.json());


app.get("/",(req,res) => {
    res.send("HELLO");
});
app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/message",messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,console.log(`Server started on port ${PORT}`));

const io = require("socket.io")(server,{
    pingTimeout:6000,
    cors:{
        origin:"http://localhost:3000",
    },
});

io.on("connection",(socket) => {
    console.log("connected to socket.io");

    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat",(room)=>{
        socket.join(room);
        console.log("user joined room"+room);
    });

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));

    socket.on("new message",(newMessageRecieved) => {
        let chat = newMessageRecieved.chat;
        if(!chat.users)  return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessageRecieved.sender._id)   return;
            socket.in(user._id).emit("message recieved",newMessageRecieved);
        });
    });
});
