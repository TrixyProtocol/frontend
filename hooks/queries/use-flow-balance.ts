"use client";

import {
  useFlowCurrentUser,
  useFlowQuery,
  useFlowConfig,
} from "@onflow/react-sdk";

const FLOW_BALANCE_SCRIPT = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

access(all) fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.capabilities
        .get<&FlowToken.Vault>(/public/flowTokenBalance)
        .borrow()
        ?? panic("Could not borrow Balance reference to the Vault")
    return vaultRef.balance
}
`;

const CONTRACT_ADDRESSES: Record<string, Record<string, string>> = {
  testnet: {
    FungibleToken: "0x9a0766d93b6608b7",
    FlowToken: "0x7e60df042a9c0868",
  },
  mainnet: {
    FungibleToken: "0xf233dcee88fe0abe",
    FlowToken: "0x1654653399040a61",
  },
  emulator: {
    FungibleToken: "0xee82856bf20e2aa6",
    FlowToken: "0x0ae53cb6e3f42a79",
  },
};

export function useFlowBalance() {
  const { user } = useFlowCurrentUser();
  const { flowNetwork } = useFlowConfig();

  const address = user?.addr;
  const network = flowNetwork || "testnet";

  const formattedAddress = address
    ? address.startsWith("0x")
      ? address
      : `0x${address}`
    : "";

  const script = FLOW_BALANCE_SCRIPT.replace(
    /0xFungibleToken/g,
    CONTRACT_ADDRESSES[network].FungibleToken,
  ).replace(/0xFlowToken/g, CONTRACT_ADDRESSES[network].FlowToken);

  const { data, isLoading, error, refetch } = useFlowQuery({
    cadence: script,
    args: (arg, t) => [arg(formattedAddress, t.Address)],
  });

  const balance = data ? parseFloat(String(data)) : 0;

  return {
    balance,
    balanceRaw: data,
    isLoading,
    error,
    refetch,
    hasBalance: balance > 0,
    isConnected: !!address,
  };
}
