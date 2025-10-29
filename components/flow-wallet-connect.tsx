"use client";

import { Connect, useFlowConfig } from "@onflow/react-sdk";
import { useEffect, useState } from "react";

export function FlowWalletConnect() {
  const { flowNetwork } = useFlowConfig();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-default-100">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor:
              flowNetwork === "testnet"
                ? "#00ef8b"
                : flowNetwork === "mainnet"
                  ? "#3b82f6"
                  : "#a855f7",
          }}
        />
        <span className="text-xs font-medium capitalize">{flowNetwork}</span>
      </div>

      {mounted && <Connect />}
    </div>
  );
}
