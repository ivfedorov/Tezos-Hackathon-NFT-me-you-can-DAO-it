import { Text, Box, Input, InputGroup, InputRightElement, Button } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useTezos } from "../hooks/useDApp";
import { Preloader } from "./Preloader";

function prepareTransferParams(
  from: string,
  to: string,
  token_id: string,
  amount: string
) {
  return [
    {
      from_: from,
      txs: [{ to_: to, token_id: token_id, amount }],
    },
  ];
}

export const Transfer: React.FC<{
  contractAddress: string;
  tokenId: string;
  pkh: string;
}> = ({ contractAddress, tokenId, pkh }) => {
  const Tezos = useTezos()!;
  const [amount, setAmount] = useState("50");
  const [to, setTo] = useState<string>("KT1Hq5Pj5NspGsWC8Py6gSoqQbYLX1zxkSsh");
  const [fetching, setFetching] = useState(false);

  const handleClick = useCallback(async () => {
    setFetching(true);
    try {
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods
        .transfer(prepareTransferParams(pkh, to, tokenId, amount))
        .send();

      await op.confirmation(1);
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  }, [setFetching, contractAddress, Tezos.wallet, amount, tokenId, pkh, to]);

  return (
    <Box w="full">
      <Text size="sm" align="left" marginBottom="2">
        Transfer token:
      </Text>
      {!fetching ? (
        <>
          <Button className={"changeButton"} onClick={handleClick}>
            Change
          </Button>
        </>
      ) : (
          <h1>Loading...</h1>
      )}
    </Box>
  );
};
