"use client";

import { useState } from "react";

declare global {
  interface Window {
    freighterApi?: {
      isConnected?: () => Promise<boolean>;
      getPublicKey?: () => Promise<string>;
      signTransaction?: (xdr: string, opts?: unknown) => Promise<{ signedTxXdr: string }>;
    };
  }
}

export function ShieldButton() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      if (!window.freighterApi) {
        throw new Error("Freighter is not available in this browser.");
      }

      const isConnected = await window.freighterApi.isConnected?.();
      if (!isConnected) {
        throw new Error("Freighter is not connected yet.");
      }

      const publicKey = await window.freighterApi.getPublicKey?.();
      if (!publicKey) {
        throw new Error("Freighter did not return a public key.");
      }

      setAddress(publicKey);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect wallet.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={connectWallet}
        className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 font-medium text-emerald-300 transition hover:bg-emerald-500/20"
      >
        {address ? `Connected: ${address.slice(0, 8)}…` : "Connect Freighter"}
      </button>
      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
    </div>
  );
}
