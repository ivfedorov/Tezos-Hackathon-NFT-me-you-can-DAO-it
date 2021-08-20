import * as React from "react";
import { ChakraProvider, Box, VStack, Grid, theme } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Dashboard } from "./components/Dashboard";
import { Logo } from "./Logo";
import { DAppProvider } from "./hooks/useDApp";


export const App = () => (
  <DAppProvider appName="SpaceTraders">
  <Dashboard />
  </DAppProvider>
);
