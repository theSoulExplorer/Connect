import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user,handleFunction}) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      background="#e8e8e8"
      _hover={{
        background:"#38b2ac",
        color:"white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.profilePhoto}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs">
                <b>Username : </b>
                {user.username}
            </Text>
        </Box>
    </Box>
  )
}

export default UserListItem
