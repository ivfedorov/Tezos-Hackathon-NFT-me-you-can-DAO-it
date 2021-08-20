import { Box, Textarea, Text } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { useTezos } from "../hooks/useDApp";
import { usePendingPromise } from "../hooks/usePendingPromise";
import { Preloader } from "./Preloader";

export const StorageInfo: React.FC<{
  contractAddress: string;
}> = ({ contractAddress }) => {
  const Tezos = useTezos()!;
  const fetcher = useCallback(
    async () => (await Tezos.contract.at(contractAddress)).storage(),
    [Tezos.contract, contractAddress]
  );
  const { fetching, data: storage, error } = usePendingPromise(
    fetcher,
    JSON.stringify
  );

  return !fetching && (storage || error) ? (
    <Box w="full">
      <Text size="m" align="left" marginBottom="2">
        Contract Storage:
      </Text>
      <Textarea readOnly defaultValue={error || storage} isInvalid={!!error} />
    </Box>
  ) : (
    <Preloader />
  );
};
