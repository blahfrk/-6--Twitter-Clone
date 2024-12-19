import {
  Container,
  Button,
  Flex,
  Spacer,
  Box,
  Heading,
  Card,
  Text,
  FormControl,
  FormLabel,
  Input,
  Divider,
} from "@chakra-ui/react";
import Tweet from "./Tweet";
import { useNavigate } from "react-router-dom";
import firebaseApp from "./firebaseConfig";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useState, useEffect } from "react";

export default function Home() {
  let navigate = useNavigate();

  const [userProfile, setUserProfile] = useState("");

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    // To check if there is an authenticated/logged in account (if there is a current session of account)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // If account is authenticated/logged in, it will redirect to home page
        setUserProfile({
          // To display the name and email of the user
          email: user.email,
          name: user.displayName,
        });
      } else {
        // If no account is authenticated/logged in, it will redirect to login page
        navigate("./login");
      }
    });
  }, []);

  // To stop the current session or basically logs out the current authenticated user
  const Logout = () => {
    const auth = getAuth(firebaseApp);
    signOut(auth).then(() => {
      navigate("./login");
    });
  };

  return (
    <Container maxW="1024px" pt={100}>
      <Heading fontWeight="black" size="3xl" color="#1DA1F2">
        twitterX
      </Heading>
      <Text>Connect with anyone.</Text>
      <Flex>
        <Box w="250px">
          <Card mt={5} p={5}>
            <Text fontWeight="bold">{userProfile.name}</Text>
            <Text>{userProfile.email}</Text>
            <Button mt={5} size="xs" onClick={Logout}>
              Logout
            </Button>
          </Card>
        </Box>
        <Spacer />
        <Box w="700px">
          <Card mt={5} p={5}>
            <FormControl>
              <FormLabel>What's on your mind? 💬</FormLabel>
              <Input type="email" />
            </FormControl>
            <Button w="100px" colorScheme="blue" mt={3} size="sm">
              Tweet
            </Button>
          </Card>
          <Divider my={5}></Divider>

          <Tweet />
        </Box>
      </Flex>
    </Container>
  );
}
