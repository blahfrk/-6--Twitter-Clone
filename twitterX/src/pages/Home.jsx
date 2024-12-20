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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // import firebase "auth" service for user authentication
import {
  getFirestore,
  addDoc,
  collection,
  Timestamp,
  onSnapshot,
} from "firebase/firestore"; // import firebase "firestore" service for tweets database
import { useState, useEffect } from "react";

export default function Home() {
  let navigate = useNavigate();
  const auth = getAuth(firebaseApp); // Initialized connection to firebase "auth" service
  const db = getFirestore(firebaseApp); // Initialized connection to firebase "firestore" service or basically the database

  const [userProfile, setUserProfile] = useState("");
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]); // Collection of tweets

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
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

    // Retreive tweets from firestore
    onSnapshot(collection(db, "tweets"), (snapshot) => {
      setTweets(snapshot.docs.map((t) => t.data()));
    });
  }, []);

  const createTweet = () => {
    setButtonLoading(true); // Loading icon in tweet button
    if (tweet !== "") {
      const tweetData = {
        // Storing of the user data in the firestore for identification of who tweeted the tweet and the tweet itself
        body: tweet, // The tweet itself
        user_email: userProfile.email, // email of the user who tweeted
        name: userProfile.name, // name of the user who tweeted
        date_posted: Timestamp.now(), // time & date tweet posted
      };
      // Adding the tweet doc to firestore database named as 'tweets'
      addDoc(collection(db, "tweets"), tweetData).then(() => {
        setTweet("");
        setButtonLoading(false);
      });
    } else {
      alert("Tweet cannot be empty!").then(() => {
        setButtonLoading(false);
      });
    }
  };

  // To stop the current session or basically logs out the current authenticated user
  const Logout = () => {
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
              <Input
                disabled={buttonLoading} // Input field disabled if button loading
                type="text"
                onChange={(e) => {
                  setTweet(e.target.value);
                }}
                value={tweet}
              />
            </FormControl>
            <Button
              isLoading={buttonLoading} // ChakraUI button loading
              w="100px"
              colorScheme="blue"
              mt={3}
              size="sm"
              onClick={createTweet}
            >
              Tweet
            </Button>
          </Card>
          <Divider my={5}></Divider>

          {tweets.map((tweetRecord) => (
            <Tweet
              key={tweetRecord.id}
              body={tweetRecord.body}
              email={tweetRecord.user_email}
              name={tweetRecord.name}
              date_posted={tweetRecord.date_posted.toDate().toString()}
            ></Tweet>
          ))}
        </Box>
      </Flex>
    </Container>
  );
}
