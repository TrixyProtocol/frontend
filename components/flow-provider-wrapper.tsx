"use client";

import { FlowProvider } from "@onflow/react-sdk";
import { ReactNode } from "react";

import flowJSON from "../flow.json";

import { siteConfig } from "@/config/site";

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

        appDetailTitle: siteConfig.name,
        appDetailUrl: siteConfig.url,
        appDetailIcon: "/logo-white.png",
        appDetailDescription: siteConfig.description,

        computeLimit: 1000,
        walletconnectProjectId: "b4876f2e352abe23effb6273efd564af",
      }}
      flowJson={flowJSON}
    >
      {children}
    </FlowProvider>
  );
}
