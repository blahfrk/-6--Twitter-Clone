import { Card, Text, Divider, Button, Input } from "@chakra-ui/react";
import { useState } from "react";

export default function Tweet({
  id,
  body,
  email,
  name,
  date_posted,
  userEmail,
  deleteTweet,
  editTweet,
}) {
  const [isEditing, setIsEditing] = useState(false); // Track if the tweet is being edited
  const [newBody, setNewBody] = useState(body); // Track the updated tweet body

  const handleSave = async () => {
    if (newBody.trim() === "") {
      alert("Tweet cannot be empty!");
      return;
    }

    try {
      await editTweet(id, newBody); // Pass the correct `id` and `newBody` to the parent function
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Failed to save the tweet:", error);
    }
  };

  return (
    <Card mt={5} px={5} pb={5} pt={2} bg="rgb(32, 41, 70)" color="white">
      <Text fontWeight="bold">{name}</Text>
      <Text fontSize="xs" color="gray">
        🕒 {date_posted}
      </Text>
      <Divider my={2} color="lightgray"></Divider>
      {isEditing ? (
        <Input
          value={newBody} // Initial content/valaue is the body which is set in the useState above
          onChange={(e) => setNewBody(e.target.value)}
          size="sm"
        />
      ) : (
        <Text>{body}</Text>
      )}
      {email === userEmail && ( // Only show buttons for the current user's tweets
        <div>
          {isEditing ? (
            <>
              <Button
                size="xs"
                colorScheme="green"
                onClick={handleSave}
                mt={2}
                mr={2}
              >
                Save
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => setIsEditing(false)} // Cancel editing
                mt={2}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="xs"
                colorScheme="blue"
                onClick={() => setIsEditing(true)} // Enter editing mode
                mt={2}
                mr={2}
              >
                Edit
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                onClick={() => deleteTweet(id)} // Delete the tweet
                mt={2}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
