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
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import firebaseApp from "../firebaseConfig";
import {
  getAuth, // To check who is authenticated
  createUserWithEmailAndPassword, // Registration of account by Email and Password to firebase
  updateProfile, // To associate autheticated account to the name field
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // alert nofication styling

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  // Registration Function
  const handleRegistration = () => {
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword
    ) {
      const auth = getAuth(firebaseApp); // To connect to the authentication component or function of firebase
      createUserWithEmailAndPassword(auth, email, password) // Actual creation of account if successful in if-else condition
        // wil run after successful creation of account
        .then((userCredential) => {
          const user = userCredential.user;

          updateProfile(auth.currentUser, {
            displayName: name, // To display users name in the homepage
          });
          navigate("/"); // Navigate to home page
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
    <Container maxW="1024px" p={40}>
      <Heading size="3xl" mb={5}>
        Welcome to twitterX!
      </Heading>
      <Text fontSize="3xl" color="#4A5568" mb={5}>
        Create an account here
      </Text>

      {/* Register Form */}
      <Card>
        <CardBody>
          <FormControl>
            <h1>{name}</h1>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </FormControl>

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
            <h1>At least 6 characters</h1> <h1>{password}</h1>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
            />
          </FormControl>

          <FormControl>
            <h1>{confirmPassword}</h1>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
            />
          </FormControl>
          <Button mt={5} colorScheme="blue" onClick={handleRegistration}>
            Create account
          </Button>
          <Box mt={5}>
            <Link to="/">
              {/* to use the Link alias add/nest in <ChakraLink> */}
              <ChakraLink>Already have an account? Login here.</ChakraLink>
            </Link>
          </Box>
        </CardBody>
      </Card>
    </Container>
  );
}
