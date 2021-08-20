import { validateAddress } from "@taquito/utils";

export const validateTezosAddress = (addr: string) =>
  validateAddress(addr) === 3;

export const validateContractAddress = (addr: string) =>
  validateTezosAddress(addr) && addr.startsWith("KT1");
