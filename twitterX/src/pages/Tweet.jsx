import { Card, Text, Divider } from "@chakra-ui/react";

export default function Tweet({ body, email, name, date_posted }) {
  return (
    <Card mt={5} px={5} pb={5} pt={2}>
      <Text fontWeight="bold">{name}</Text>
      <Text fontSize="xs" color="gray">
        🕒 {date_posted}
      </Text>
      <Divider my={2} color="lightgray"></Divider>
      <Text>{body}</Text>
    </Card>
  );
}
