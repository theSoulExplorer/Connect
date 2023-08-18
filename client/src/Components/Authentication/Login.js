import { Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react'
import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

// import { ChatState } from '../../Context/ChatProvider';

const Login = () => {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const history = useHistory();
    const toast = useToast();

    const { setUser } = ChatState();


    const submitHandler = async() => {
      if(!username || !password){
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
          const config = {
              headers: {
                  "Content-type":"application/json",
              },
          };
          const {data} = await axios.post(
              "/user/login",
              {username,password},
              config
          );
          // console.log(JSON.stringify(data));
          toast({
              title:"Login Successfull",
              status:"success",
              duration:5000,
              isClosable:true,
              position:"bottom",
          });
          localStorage.setItem("userInfo",JSON.stringify(data));
        //   alert("info set");
            setUser(data);
          history.push("/chats");
        // <Redirect to='/chats' />
      } catch (error) {
          console.log(error);
          toast({
              title:"Error Occured",
              description:error.response.data.message,
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
        <Button
        colorScheme="purple"
        width="100%"
        onClick={submitHandler}
        >
        Login
        </Button>
      </VStack>
    </div>
  )
}

export default Login
