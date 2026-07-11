import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  rpcUrl: process.env.SOROBAN_RPC_URL ?? "https://soroban-testnet.stellar.org",
  networkPassphrase:
    process.env.STELLAR_NETWORK_PASSPHRASE ?? "Test SDF Network ; September 2015",
  contractId: process.env.RENT_GELATO_CONTRACT_ID ?? "",
  pollIntervalMs: Number(process.env.KEEPER_POLL_INTERVAL_MS ?? 60_000),
  lowTtlThreshold: Number(process.env.KEEPER_LOW_TTL_THRESHOLD ?? 1_000),
  // Only resolved lazily by callers that actually need to sign, so the
  // daemon can still boot (e.g. for dry runs) without a key configured.
  requireKeeperSecretKey: () => requireEnv("KEEPER_SECRET_KEY"),
};
