import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import * as secp from '@noble/secp256k1';
let ToBase64 = function (u8) {
    return btoa(String.fromCharCode.apply(null, u8));
}

let FromBase64 = function (str) {
    return atob(str).split('').map(function (c) { return c.charCodeAt(0); });
}
const Registration = () => {
    const [name, setName] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const history = useHistory();
    
    const toast = useToast();

    const submitHandler = async() => {
        if(!name || !username || !password || !confirmPassword){
            toast({
                title:"Please Fill all the Fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
            return;
        }
        try {

            const privKey = secp.utils.randomPrivateKey();
            const pubKey = secp.getPublicKey(privKey);

            var pbkey  = ToBase64(pubKey);
            var prkey  = ToBase64(privKey);
            // console.log(typeof(pubKey)," : ",typeof(pkey)," : ",pkey);
            // var x = FromBase64(pkey);
            // console.log(x," : ",pubKey," | ",typeof(x)," | ",(x===pubKey));

            // const priv1 = secp.utils.randomPrivateKey();
            // const pubKey2 = secp.getPublicKey(priv1);
            // const shared = secp.getSharedSecret(privKey, pubKey2);
            // const shared2 = secp.getSharedSecret(priv1, x);

            // var sh = btoa(String.fromCharCode.apply(null, shared));
            // var sh2 = btoa(String.fromCharCode.apply(null, shared2));
            // console.log("shared1 : ",sh);
            // console.log("shared2 : ",sh2);
            // console.log("are equal? ",sh===sh2);

            // const msg="ban gya bhai";
            // const encrypted = encrypt(msg, sh);
            // console.log("encrypted : ",encrypted);

            // const decrypted = decrypt(encrypted, sh2);
            // console.log("decrypted : ",decrypted);


            const config = {
                headers: {
                    "Content-type":"application/json",
                },
            };
            const {data} = await axios.post(
                "/user/register",
                {name,username,password,publicKey:pbkey},
                config
            );
            // console.log(JSON.stringify(data));
            toast({
                title:"Registration Successfull",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });

            // const x=username+"Keys";
            localStorage.setItem(username+"_privkey",prkey);
            localStorage.setItem("userInfo",JSON.stringify(data));
            history.push("/chats");
        } catch (error) {
            toast({
                title:"Error Occured",
                description:error,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom",
            });
        }
    };



  return (
    <div>
      <VStack spacing="5px">
        <FormControl isRequired id='first-name'>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id='username'>
            <FormLabel>Username</FormLabel>
            <Input
                placeholder='Username'
                onChange={(e)=>setUsername(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id='password'>
            <FormLabel>Password</FormLabel>
            <Input
                type='password'
                placeholder='Password'
                onChange={(e)=>setPassword(e.target.value)}
            />
        </FormControl>
        <FormControl isRequired id='cpassword'>
            <FormLabel>Confirm Password</FormLabel>
            <Input
                type='password'
                placeholder='Confirm Password'
                onChange={(e)=>setConfirmPassword(e.target.value)}
            />
        </FormControl>
        <Button
        colorScheme="purple"
        width="100%"
        onClick={submitHandler}
        >
        Register
        </Button>
      </VStack>
    </div>
  )
}

export default Registration
