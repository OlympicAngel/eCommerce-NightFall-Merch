import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/AuthProvider";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider>
    <AuthProvider>
      <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT, "currency": "ILS" }}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </PayPalScriptProvider>
    </AuthProvider>
  </ChakraProvider>
);
