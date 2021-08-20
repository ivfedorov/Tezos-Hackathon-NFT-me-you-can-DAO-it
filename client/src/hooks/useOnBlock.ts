import { TezosToolkit } from "@taquito/taquito";
import React from "react";

export function useOnBlock(
  tezos: TezosToolkit,
  callback: (...args: any[]) => void
) {
  const blockHashRef = React.useRef<string>();

  React.useEffect(() => {
    let sub: any;
    spawnSub();
    return () => sub.close();

    function spawnSub() {
      sub = tezos.stream.subscribe("head");

      sub.on("data", (hash: string) => {
        if (blockHashRef.current && blockHashRef.current !== hash) {
          callback(hash);
        }
        blockHashRef.current = hash;
      });
      sub.on("error", (err: any) => {
        if (process.env.NODE_ENV === "development") {
          console.error(err);
        }
        sub.close();
        spawnSub();
      });
    }
  }, [tezos, callback]);
}
