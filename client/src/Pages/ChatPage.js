import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { ChatState } from '../Context/ChatProvider';
import SideDrawer from '../Components/Miscellaneous/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';
import { Box } from '@chakra-ui/react';

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain,setFetchAgain] = useState(false);
  return (
    <div style={{width:"100%"}}>
      

      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>


    </div>
  )
}

export default ChatPage
