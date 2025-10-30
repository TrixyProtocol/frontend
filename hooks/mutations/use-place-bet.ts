"use client";

import { useFlowMutate, useFlowConfig } from "@onflow/react-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { addToast } from "@heroui/react";

import { TRIXY_CONTRACT_ADDRESS } from "@/lib/contracts";

const PLACE_BET_TRANSACTION = `
  import TrixyProtocol from 0xTrixyProtocol
  import FungibleToken from 0xFungibleToken
  import FlowToken from 0xFlowToken

  transaction(marketCreator: Address, marketId: UInt64, option: String, amount: UFix64) {
      
      let manager: &TrixyProtocol.MarketManager
      let payment: @FlowToken.Vault
      let signerAddress: Address
      
      prepare(signer: auth(Storage) &Account) {
          self.signerAddress = signer.address
          
          self.manager = getAccount(marketCreator).capabilities.borrow<&TrixyProtocol.MarketManager>(
              TrixyProtocol.MarketManagerPublicPath
          ) ?? panic("Could not borrow MarketManager from market creator")
          
          let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
              from: /storage/flowTokenVault
          ) ?? panic("Could not borrow FlowToken.Vault")
          
          self.payment <- vaultRef.withdraw(amount: amount) as! @FlowToken.Vault
      }
      
      execute {
          let market = self.manager.borrowMarket(marketId: marketId)
              ?? panic("Market not found")
          
          market.placeBet(
              user: self.signerAddress,
              option: option,
              payment: <-self.payment,
              protocolFee: 0.02
          )
          
          log("Bet placed successfully!")
          log("Market: ".concat(marketId.toString()))
          log("Option: ".concat(option))
          log("Amount: ".concat(amount.toString()))
      }
  }
`;

const CONTRACT_ADDRESSES: Record<string, Record<string, string>> = {
  testnet: {
    TrixyProtocol: TRIXY_CONTRACT_ADDRESS,
    FungibleToken: "0x9a0766d93b6608b7",
    FlowToken: "0x7e60df042a9c0868",
  },
  mainnet: {
    TrixyProtocol: "TDB",
    FungibleToken: "TDB",
    FlowToken: "TDB",
  },
  emulator: {
    TrixyProtocol: "UNUSED",
    FungibleToken: "UNUSED",
    FlowToken: "UNUSED",
  },
};

interface PlaceBetParams {
  marketCreator: string;
  marketId: string | number;
  option: string;
  amount: string | number;
}

export function usePlaceBet() {
  const { flowNetwork } = useFlowConfig();
  const network = flowNetwork || "testnet";
  const queryClient = useQueryClient();

  const transaction = PLACE_BET_TRANSACTION.replace(
    /0xTrixyProtocol/g,
    CONTRACT_ADDRESSES[network].TrixyProtocol,
  )
    .replace(/0xFungibleToken/g, CONTRACT_ADDRESSES[network].FungibleToken)
    .replace(/0xFlowToken/g, CONTRACT_ADDRESSES[network].FlowToken);

  const { mutate, isPending, isSuccess, error, data } = useFlowMutate();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: ["market"] });
      queryClient.invalidateQueries({ queryKey: ["markets"] });
      queryClient.invalidateQueries({ queryKey: ["chart"] });
    }
  }, [isSuccess, queryClient]);

  const placeBet = (params: PlaceBetParams) => {
    const { marketCreator, marketId, option, amount } = params;

    const formattedAmount =
      typeof amount === "string"
        ? parseFloat(amount).toFixed(8)
        : amount.toFixed(8);

    const formattedCreator = marketCreator.startsWith("0x")
      ? marketCreator
      : `0x${marketCreator}`;

    const formattedMarketId =
      typeof marketId === "string" ? parseInt(marketId, 10) : marketId;

    mutate(
      {
        cadence: transaction,
        args: (arg, t) => [
          arg(formattedCreator, t.Address),
          arg(formattedMarketId.toString(), t.UInt64),
          arg(option, t.String),
          arg(formattedAmount, t.UFix64),
        ],
      },
      {
        onSuccess: () => {
          addToast({
            title: "Bet Placed",
            description: `Your bet of ${formattedAmount} FLOW on ${option} has been placed successfully.`,
            color: "success",
          });
        },
        onError: (error) => {
          addToast({
            title: "Error Claiming Winnings",
            description: error.message,
            color: "danger",
          });
        },
      },
    );
  };

  return {
    placeBet,
    isPending,
    isSuccess,
    error,
    transactionId: data,
  };
}
