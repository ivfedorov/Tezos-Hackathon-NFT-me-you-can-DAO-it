import React from "react";
import { Spinner, SpinnerProps } from "@chakra-ui/react";

export const Preloader: React.FC<SpinnerProps> = (props) => (
  <Spinner
    thickness="4px"
    speed="0.65s"
    emptyColor="gray.200"
    color="blue.500"
    size="sm"
    alignSelf="center"
    {...props}
  />
);
