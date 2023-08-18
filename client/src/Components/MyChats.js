import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { getSender } from '../config/ChatLogics';

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser] = useState();
  const {selectedChat,setSelectedChat,user,chats,setChats} = ChatState();
  const toast = useToast();

  const fetchChats = async() => {
    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/chat",config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title:"Error Occured",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"

      });
    }
  }


  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[fetchAgain]);


  return (
    <Box
      display={{base:selectedChat?"none":"flex",md:"flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      background="white"
      w={{base:"100%",md:"31%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{base:"28px",md:"30px"}}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        background="#f8f8f8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats?(
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                background={selectedChat===chat?"#3882ac":"#e8e8e8"}
                color={selectedChat===chat?"white":"black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >

                <Text>
                  {getSender(loggedUser,chat.users)}
                </Text>
              </Box>
            ))}
          </Stack>
        ):(
          <Text>Loading Chats...</Text>
        )}
      </Box>
    </Box>
  );
};

export default MyChats
