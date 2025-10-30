"use client";

import { Avatar } from "@heroui/react";
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
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-default-100">
        <Avatar className="w-6 h-6" src="/images/token/flow.png" />
        <span className="text-xs font-medium capitalize">{flowNetwork}</span>
      </div>

      {mounted && <Connect />}
    </div>
  );
}
