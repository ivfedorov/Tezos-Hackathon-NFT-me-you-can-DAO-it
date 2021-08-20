import React from "react";
import {
  Input,
  InputLeftElement,
  InputProps,
  InputGroup,
  Box,
  Text,
} from "@chakra-ui/react";

export const GenericInput: React.FC<{
  title: string;
  icon: React.ReactNode;
  inputProps: InputProps;
}> = ({ title, icon, inputProps }) => (
  <Box w="full">
    <Text size="sm" align="left" marginBottom="2">
      {title}:
    </Text>
    <InputGroup>
      {icon && <InputLeftElement children={icon} />}
      <Input {...inputProps} />
    </InputGroup>
  </Box>
);
