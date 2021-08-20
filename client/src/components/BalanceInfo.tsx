import { Box, Input, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useTezos } from "../hooks/useDApp";
import { usePendingPromise } from "../hooks/usePendingPromise";
import { Preloader } from "./Preloader";


export const BalanceInfo: React.FC<{
  contractAddress: string;
  tokenId: string;
  pkh: string;
}> = ({ contractAddress, tokenId, pkh }) => {
  const Tezos = useTezos()!;
  const fetcher = useCallback(() => {
    return Tezos.contract.at(contractAddress).then((contract: any) => {
      return contract.views
        .balance_of([{ token_id: tokenId, owner: pkh }])
        .read()
        .then((res: any[]) => res[0].balance.toString())
        .catch((e: any) => {
          console.error(e);
          return 0;
        });
    });
  }, [Tezos, contractAddress, tokenId, pkh]);

  const { fetching, data: storage, error } = usePendingPromise(fetcher);

  return !fetching ? (
    <>
      <Box w="full">
        <Text size="sm" align="left" marginBottom="2">FA2 Balance:</Text>
        <Input
          readOnly
          type="text"
          defaultValue={error || storage}
          isInvalid={!!error}
        />
      </Box>
    </>
  ) : (
    <Preloader />
  )
};
