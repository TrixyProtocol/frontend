"use client";

import { useFlowMutate, useFlowConfig } from "@onflow/react-sdk";
import { addToast } from "@heroui/react";

import { TRIXY_CONTRACT_ADDRESS } from "@/lib/contracts";

const CLAIM_WINNINGS_TRANSACTION = `
  import TrixyProtocol from 0xTrixyProtocol
  import FungibleToken from 0xFungibleToken
  import FlowToken from 0xFlowToken

  transaction(marketCreator: Address, marketId: UInt64) {
      
      let manager: &TrixyProtocol.MarketManager
      let receiver: &FlowToken.Vault
      let signerAddress: Address
      
      prepare(signer: auth(Storage) &Account) {
          self.signerAddress = signer.address
          
          self.manager = getAccount(marketCreator).capabilities
              .borrow<&TrixyProtocol.MarketManager>(TrixyProtocol.MarketManagerPublicPath)
              ?? panic("Could not borrow MarketManager")
          
          self.receiver = signer.storage.borrow<&FlowToken.Vault>(
              from: /storage/flowTokenVault
          ) ?? panic("Could not borrow FlowToken.Vault")
      }
      
      execute {
          let market = self.manager.borrowMarket(marketId: marketId)
              ?? panic("Market not found")
          
          let payout <- market.claimWinnings(user: self.signerAddress)
          let amount = payout.balance
          
          self.receiver.deposit(from: <-payout)
          
          log("Winnings claimed successfully!")
          log("Amount: ".concat(amount.toString()).concat(" FLOW"))
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

interface ClaimWinningsParams {
  marketCreator: string;
  marketId: string | number;
}

export function useClaimWinnings() {
  const { flowNetwork } = useFlowConfig();
  const network = flowNetwork || "testnet";

  const transaction = CLAIM_WINNINGS_TRANSACTION.replace(
    /0xTrixyProtocol/g,
    CONTRACT_ADDRESSES[network].TrixyProtocol,
  )
    .replace(/0xFungibleToken/g, CONTRACT_ADDRESSES[network].FungibleToken)
    .replace(/0xFlowToken/g, CONTRACT_ADDRESSES[network].FlowToken);

  const { mutate, isPending, isSuccess, error, data } = useFlowMutate();

  const claimWinnings = (params: ClaimWinningsParams) => {
    const { marketCreator, marketId } = params;

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
        ],
      },
      {
        onSuccess: () => {
          addToast({
            title: "Winnings Claimed",
            description: "Your winnings have been claimed successfully.",
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
    claimWinnings,
    isPending,
    isSuccess,
    error,
    transactionId: data,
  };
}
