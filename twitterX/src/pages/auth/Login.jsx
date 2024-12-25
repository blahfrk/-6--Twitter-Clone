import {
  FormControl,
  FormLabel,
  Input,
  Heading,
  Text,
  Container,
  Button,
  Link as ChakraLink, // as ChakraLink (alias) - to avoid error from Link in Chakra (styles) and Link in react-router-dom (function)
  Box,
  Card,
  CardBody,
  Flex,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import firebaseApp from "../firebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // alert nofication styling

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    // To check if there is an authenticated/logged in account (if there is a current session of account)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // If account is authenticated/logged in, it will redirect to home page
        navigate("/");
      } else {
        // else is not needed here
        // If no account is authenticated/logged in, it will redirect to login page
      }
    });
  }, []);

  // Login Function
  const handleLogin = () => {
    if (email !== "" && password !== "") {
      const auth = getAuth(firebaseApp); // To connect to the authentication component or function of firebase
      signInWithEmailAndPassword(auth, email, password) // Actual Login if autheticated
        // wil run after successful login of account
        .then(() => {
          navigate("/"); // Navigate to home page
        })
        // Will run if email or password is incorrect
        .catch((error) => {
          Swal.fire({
            text: "Invalid email or password",
            icon: "error",
            confirmButtonColor: "#3085d6",
          });
        });
    } else {
      Swal.fire({
        text: "There are invalid field parameters. Please try again!",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <Container maxW={{ base: "100%", md: "1024px" }} p={{ base: 5, md: 40 }}>
      <Flex direction="column" align="center" justify="center" minH="100vh">
        <Heading size="3xl" mb={5} color="white">
          Welcome to{" "}
          <Text as="span" color="#1DA1F2">
            twitterX!
          </Text>
        </Heading>
        <Text fontSize="3xl" color="#e0e0e0" mb={5}>
          Login to your account
        </Text>

        {/* Login Form */}
        <Card bg="rgb(32, 41, 70)" color="white" w="100%">
          <CardBody>
            <FormControl>
              <h1>{email}</h1>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
              />
            </FormControl>

            <FormControl>
              <h1>{password}</h1>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                value={password}
              />
            </FormControl>
            <Button mt={5} colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
            <Box mt={5}>
              <Link to="/register">
                {/* to use the Link alias add/nest in <ChakraLink> */}
                <ChakraLink>Don't have an account? Register here.</ChakraLink>
              </Link>
            </Box>
          </CardBody>
        </Card>
      </Flex>
    </Container>
  );
}
