import { Button, Code, Text } from '@chakra-ui/react';
import React from 'react';
import { ArrowDownUp, GeoAltFill } from "react-bootstrap-icons";


export const AccountInfo: React.FC<{
  account: string;
  handleReconnect: (...args: any[]) => void;
}> = ({ account, handleReconnect }) => (
  <>
      {/*<Text>Your account: <Code size="1">{account}</Code> </Text>*/}
    <Button class onClick={handleReconnect} alignSelf="center"></Button>
  </>
);
