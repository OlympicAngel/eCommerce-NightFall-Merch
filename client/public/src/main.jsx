import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ChakraProvider } from "@chakra-ui/react";
import AuthProvider from "./context/AuthProvider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import theme from './theme.js'
import "./style.css"
import CartProvider from "./context/CartProvider.jsx";
import RealTimeData from "./context/RealTimeData.jsx";


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <AuthProvider>
      <RealTimeData>

        <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT, "currency": "ILS" }}>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </CartProvider>
        </PayPalScriptProvider>
      </RealTimeData>
    </AuthProvider>
  </ChakraProvider>
);
