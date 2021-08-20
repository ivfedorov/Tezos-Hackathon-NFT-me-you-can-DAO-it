import React from "react";
import constate from "constate";
import { TempleWallet } from "@temple-wallet/dapp";
import { TezosToolkit } from "@taquito/taquito";
import { Signer } from "@taquito/taquito";

export const [
  DAppProvider,
  useWallet,
  useTezos,
  useAccountPkh,
  useReady,
  useConnect,
] = constate(
  useDApp,
  (v) => v.wallet,
  (v) => v.tezos,
  (v) => v.accountPkh,
  (v) => v.ready,
  (v) => v.connect
);

type HookState = {
  wallet: TempleWallet | null;
  tezos: TezosToolkit | null;
  accountPkh: string | null;
};

function useDApp({ appName }: { appName: string }) {
  const [{ wallet, tezos, accountPkh }, setState] = React.useState<HookState>(
    () => ({
      wallet: null,
      tezos: null,
      accountPkh: null,
    })
  );

  const ready = Boolean(tezos);

  React.useEffect(() => {
    return TempleWallet.onAvailabilityChange(async (available) => {
      if (available) {
        let perm;
        try {
          perm = await TempleWallet.getCurrentPermission();
        } catch {}

        const wlt = new TempleWallet(appName, perm);
        setState({
          wallet: wlt,
          tezos: wlt.connected ? toTezos(wlt) : null,
          accountPkh: wlt.connected ? await wlt.getPKH() : null,
        });
      } else {
        setState({
          wallet: null,
          tezos: null,
          accountPkh: null,
        });
      }
    });
  }, [appName, setState]);

  React.useEffect(() => {
    if (wallet && wallet.connected) {
      return TempleWallet.onPermissionChange((perm) => {
        if (!perm) {
          setState({
            wallet: new TempleWallet(appName),
            tezos: null,
            accountPkh: null,
          });
        }
      });
    }
  }, [wallet, appName, setState]);

  const connect = React.useCallback(
    async (network, opts) => {
      try {
        if (!wallet) {
          throw new Error("Temple Wallet not available");
        }
        await wallet.connect(network, opts);
        const tzs = toTezos(wallet);
        const pkh = await tzs.wallet.pkh();

        setState({
          wallet,
          tezos: tzs,
          accountPkh: pkh,
        });
      } catch (err) {
        alert(`Failed to connect TempleWallet: ${err.message}`);
      }
    },
    [setState, wallet]
  );

  return {
    wallet,
    tezos,
    accountPkh,
    ready,
    connect,
  };
}

class ReadOnlySigner implements Signer {
  constructor(private pkh: string, private pk: string) {}

  async publicKeyHash() {
    return this.pkh;
  }
  async publicKey() {
    return this.pk;
  }
  async secretKey(): Promise<string> {
    throw new Error("Secret key cannot be exposed");
  }
  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    throw new Error("Cannot sign");
  }
}

function toTezos(wallet: TempleWallet) {
  const tezos = wallet.toTezos();
  tezos.setSignerProvider(
    new ReadOnlySigner(wallet.permission!.pkh, wallet.permission!.publicKey)
  );

  return tezos;
}
