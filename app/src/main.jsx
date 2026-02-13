import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ApolloProvider } from "@apollo/client/react"
import { MantineProvider } from '@mantine/core';
import { theme } from "./styles/theme"
import "@mantine/core/styles.css";

import App from "./App.jsx"
import { client } from "./lib/graphql/client"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <App />
        </MantineProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
