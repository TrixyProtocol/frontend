"use client";

import { FlowProvider } from "@onflow/react-sdk";
import { ReactNode } from "react";

import flowJSON from "../flow.json";

interface FlowProviderWrapperProps {
  children: ReactNode;
}

export function FlowProviderWrapper({ children }: FlowProviderWrapperProps) {
  return (
    <FlowProvider
      config={{
        accessNodeUrl: "https://rest-testnet.onflow.org",
        discoveryWallet: "https://fcl-discovery.onflow.org/testnet/authn",
        discoveryAuthnEndpoint:
          "https://fcl-discovery.onflow.org/api/testnet/authn",
        flowNetwork: "testnet",

        appDetailTitle: "Trixy Protocol",
        appDetailUrl:
          typeof window !== "undefined" ? window.location.origin : "",
        appDetailIcon: "https://avatars.githubusercontent.com/u/62387156?v=4",
        appDetailDescription:
          "Multi-Protocol Yield Aggregator on Flow Blockchain",

        computeLimit: 1000,
        walletconnectProjectId: "9b70cfa398b2355a5eb9b1cf99f4a981",
      }}
      flowJson={flowJSON}
    >
      {children}
    </FlowProvider>
  );
}
