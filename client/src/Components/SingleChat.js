import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import * as secp from '@noble/secp256k1';
import CryptoJS from 'react-native-crypto-js';
const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const getPublicKey = (chat,userId) => {
    const users = chat.users;
    return (users[0]._id===userId?users[1].publicKey:users[0].publicKey);
}
let ToBase64 = function (u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}
let FromBase64 = function (str) {
    return atob(str).split('').map(function (c) { return c.charCodeAt(0); });
}

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const [messages,setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage,setNewMessage] = useState();
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [socketConnected,setSocketConnected] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping,setIsTyping] = useState(false);

    const toast = useToast();

    //////////////////////////////////////////////////////////////////////////////////////////////////////
    //Encryption ka kaam

    // console.log(selectedChat);

    // if(!selectedChat)   return;

    // const pbkey = getPublicKey(selectedChat,user._id);
    // const prkey = localStorage.getItem(user.username+"_privkey");
    // var pubKey = FromBase64(pbkey);
    // var privKey = FromBase64(prkey);
    // const shared = secp.getSharedSecret(privKey, pubKey);
    // var sh = ToBase64(shared);
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////


    const fetchMessages = async() => {
        if(!selectedChat)   return;
        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const {data} = await axios.get(`/message/${selectedChat._id}`,config);
            // console.log(messages);
            setMessages(data);
            setLoading(false);
            socket.emit("join chat",selectedChat._id);
        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load Messages",
                status:"error",
                duration:2000,
                isClosable:true,
                position:"bottom"
            });
        }
    }

    useEffect(() =>{
        socket = io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on("typing",()=>setIsTyping(true));
        socket.on("stop typing",()=>setIsTyping(false));
    },[]);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare=selectedChat;
    },[selectedChat]);


    useEffect(()=>{
        socket.on("message recieved",(newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }
            else{
                setMessages([...messages,newMessageRecieved]);
            }
        })
    })

    const sendMessage = async(event) => {
        if(event.key === "Enter" && newMessage){
            socket.emit("stop typing",selectedChat._id);
            try {
                const pbkey = getPublicKey(selectedChat,user._id);
                const prkey = localStorage.getItem(user.username+"_privkey");
                var pubKey = FromBase64(pbkey);
                var privKey = FromBase64(prkey);
                const shared = secp.getSharedSecret(privKey, pubKey);
                var sh = ToBase64(shared);
                let y = newMessage;
                const encrypted = CryptoJS.AES.encrypt(y, sh).toString();
                const config = {
                    headers : {
                        "Content-type" : "application/json",
                        Authorization : `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                let x = {
                    _id:"#",
                    sender:user,
                    content:y
                };
                setMessages([...messages,x]);
                const {data} = await axios.post("/message",{
                    content:encrypted,
                    chatId:selectedChat._id,
                },config);
                console.log(data);
                // setMessages([...messages,data]);
                messages[messages.length-1]=data;
                var tmp=messages;
                setMessages(tmp);
                socket.emit("new message",data);
            } catch (error) {
                toast({
                    title:"Error Occured",
                    description:"Failed to send Message",
                    status:"error",
                    duration:2000,
                    isClosable:true,
                    position:"bottom"
                });
            }
        }
    }

    
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if(!socketConnected)    return;
        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(()=>{
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        });
    }
  return (
    <>
        {
            selectedChat ? (
                <>
                    <Text
                        fontSize={{base:"28px" , md:"30px"}}
                        pb={3}
                        px={2}
                        w="100%"
                        display="flex"
                        justifyContent={{base : "space-between"}}
                        alignItems="center"
                    >
                        <IconButton 
                            display={{base : "flex" , md:"none"}}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user , selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user,selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {
                                        selectedChat.chatName.toUpperCase()
                                    }
                                </>
                            )
                        }
                    </Text>
                    <Box
                      display="flex"
                      flexDir="column"
                      justifyContent="flex-end"
                      p={3}
                      background="#e8e8e8"
                      w="100%"
                      h="100%"
                      borderRadius="lg"
                      overflowY="hidden"
                    >
                        {/* Messages */}
                        {loading?(
                            <Spinner
                                size="md"
                                w={10}
                                h={10}
                                alignSelf="center"
                                margin="auto"
                            />
                        ):(
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                            {isTyping?<div>Loading...</div>:(<></>)}
                            <Input
                            
                                variant="filled"
                                background="#e0e0e0"
                                placeholder="Enter a Message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    h="100%"
                >
                    <Text fontSize="3xl" pb={3}>
                        Click on a User to start Chatting
                    </Text>

                </Box>
            )
        }
    </>
  )
}

export default SingleChat
