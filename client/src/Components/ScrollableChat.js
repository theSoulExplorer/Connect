import React, { useEffect } from 'react'
import ScrollableFeed from 'react-scrollable-feed';
import { ChatState } from '../Context/ChatProvider';
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics';
import { Avatar, Text, Tooltip } from '@chakra-ui/react';
import * as secp from '@noble/secp256k1';
import CryptoJS from 'react-native-crypto-js';

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

const ScrollableChat = ({messages}) => {
    const {user,selectedChat} = ChatState();
    const pbkey = getPublicKey(selectedChat,user._id);
    const prkey = localStorage.getItem(user.username+"_privkey");
    var pubKey = FromBase64(pbkey);
    var privKey = FromBase64(prkey);
    const shared = secp.getSharedSecret(privKey, pubKey);
    var sh = ToBase64(shared);
    // useEffect(() => {
    // },[messages]);
  return (
    <ScrollableFeed>
        {messages && messages.map((m,i) => (
            <div style={{display:"flex"}} key={m._id}>
                {
                    (isSameSender(messages,m,i,user._id)
                    || isLastMessage(messages,i,user._id)
                    ) && (
                        <Tooltip label={m.sender.name} placement="bottom-start">
                            <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={m.sender.name}
                              src={m.sender.profilePhoto}
                            />
                        </Tooltip>
                    )
                }
                <span style={{
                    backgroundColor:`${
                        m.sender._id === user._id?"#bee3f8":"#b9f5d0"
                    }`,
                    borderRadius:"20px",
                    padding:"5px 15px",
                    maxWidth:"75%",
                    marginTop:isSameUser(messages,m,i,user._id)?3:10,
                    marginLeft:isSameSenderMargin(messages,m,i,user._id)
                }}>

                  {
                    CryptoJS.AES.decrypt(m.content, sh).toString(CryptoJS.enc.Utf8)
                    //m.content
                  }

                </span>
            </div>
        ))}
    </ScrollableFeed>
  )
}

export default ScrollableChat
