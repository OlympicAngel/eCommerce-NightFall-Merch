import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/AuthProvider";

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </ChakraProvider>
);
