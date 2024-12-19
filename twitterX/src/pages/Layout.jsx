import { Outlet } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

export default function Layout() {
  return (
    <ChakraProvider>
      <Outlet />
    </ChakraProvider>
  );
}
