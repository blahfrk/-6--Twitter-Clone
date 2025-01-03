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
  Stack,
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
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
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

    // Query to get the tweets in descending order of date_posted
    const q = query(collection(db, "tweets"), orderBy("date_posted", "desc"));
    // Real-time listener for the tweets collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Get the tweets from the snapshot
      const tweetsData = snapshot.docs.map((doc) => ({
        id: doc.id, // Adds a new 'id' property to the object and its value is the Firestore document's unique ID.
        ...doc.data(), // Adds all the properties from doc.data() including the new property 'id' (like body, user_email, etc.) into the same object.
      })); // Now, each tweet in the tweets array has an id!
      setTweets(tweetsData); // Set the tweets array to the tweetsData
    });

    return () => unsubscribe();
  }, [auth, db, navigate]);

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
      alert("Tweet cannot be empty!");
      setTimeout(() => {
        setButtonLoading(false);
      }, 1000); // Delay for 1 second before loading icon disappears
    }
  };

  const deleteTweet = async (id) => {
    await deleteDoc(doc(db, "tweets", id)); // Deletes the document with the specified ID
  };

  const editTweet = async (id, newBody) => {
    const tweetRef = doc(db, "tweets", id); // Get the reference to the tweet by ID
    try {
      await updateDoc(tweetRef, { body: newBody }); // Update the body field with newBody
      console.log("Tweet updated successfully!");
    } catch (error) {
      console.error("Error updating tweet:", error);
    }
  };

  // To stop the current session or basically logs out the current authenticated user
  const Logout = () => {
    signOut(auth).then(() => {
      navigate("./login");
    });
  };

  return (
    <Container maxW="1024px" pt={10}>
      <Heading fontWeight="black" size="3xl" color="#1DA1F2">
        twitterX
      </Heading>
      <Text color="white">Connect with anyone.</Text>
      <Flex direction={{ base: "column", md: "row" }}>
        <Box
          w={{ base: "100%", md: "250px" }}
          mb={{ base: 5, md: 0 }}
          mr={{ base: 0, md: 5 }}
        >
          <Card mt={5} p={5} bg="rgb(32, 41, 70)" color="white">
            <Text fontWeight="bold">{userProfile.name}</Text>
            <Text>{userProfile.email}</Text>
            <Button mt={5} size="xs" onClick={Logout}>
              Logout
            </Button>
          </Card>
        </Box>
        <Spacer />
        <Box
          w={{ base: "100%", md: "700px" }}
          mb={{ base: 5, md: 0 }}
          ml={{ base: 0, md: 5 }}
        >
          <Card mt={5} p={5} bg="rgb(32, 41, 70)" color="white">
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
              id={tweetRecord.id} // Pass the `id` to the Tweet component
              body={tweetRecord.body}
              email={tweetRecord.user_email}
              name={tweetRecord.name}
              date_posted={tweetRecord.date_posted.toDate().toString()}
              userEmail={userProfile.email} // Pass the current user's email to determine ownership
              deleteTweet={deleteTweet} // Pass deleteTweet function as prop
              editTweet={editTweet} // Pass editTweet function as prop
            ></Tweet>
          ))}
        </Box>
      </Flex>
    </Container>
  );
}
