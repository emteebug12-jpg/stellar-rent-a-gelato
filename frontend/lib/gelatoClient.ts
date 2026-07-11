import { rpc } from "@stellar/stellar-sdk";

/**
 * Placeholder framework for invoking the generated Soroban contract client
 * (see scripts/generate-bindings.mjs and package.json's `generate:bindings`
 * script). Once bindings exist under `src/generated`, replace the manual
 * RPC plumbing below with calls into the typed client.
 */
function getRpcServer(): rpc.Server {
  const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org";
  return new rpc.Server(rpcUrl);
}

/**
 * Fetches the live TTL (in ledgers-until-expiration) for a given contract's
 * instance storage entry.
 *
 * TODO: Invoke Soroban RPC to fetch the current live ledger entry TTL. This
 * should call `getRpcServer().getLedgerEntries(...)` for the contract's
 * instance/persistent keys and derive `liveUntilLedgerSeq - currentLedgerSeq`.
 */
export async function fetchContractTTL(contractId: string): Promise<number> {
  void contractId;
  void getRpcServer;
  // Mock value so the dashboard skeleton renders before RPC wiring lands.
  return 4320;
}
