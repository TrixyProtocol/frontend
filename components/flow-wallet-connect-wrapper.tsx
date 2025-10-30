"use client";

import { Connect, useFlowCurrentUser } from "@onflow/react-sdk";
import { useEffect, useState } from "react";

export function FlowWalletConnectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useFlowCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{mounted && !user ? <Connect /> : children}</>;
}
