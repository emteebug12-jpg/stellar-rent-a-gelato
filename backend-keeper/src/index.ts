import { Keypair, rpc } from "@stellar/stellar-sdk";
import { config } from "./config.js";

/**
 * A registration discovered on-chain that looks due for a poke.
 *
 * TODO(contributors): replace with the real shape returned once
 * `listLowTtlRegistrations` reads actual `GuardedKey` ledger entries from
 * the RentGelato contract (see contracts/rent_gelato/src/types.rs).
 */
interface LowTtlRegistration {
  registrationId: string;
  targetAddress: string;
  currentTtl: number;
}

function getServer(): rpc.Server {
  return new rpc.Server(config.rpcUrl);
}

/**
 * Scans the RentGelato contract's registration list and returns entries
 * whose live TTL has dropped below `config.lowTtlThreshold`.
 *
 * TODO: Query Soroban RPC (`getServer().getLedgerEntries(...)`) for the
 * contract's `RegistrationIds` list, resolve each `GuardedKey`, and filter
 * by remaining TTL. This currently returns a mock list so the loop skeleton
 * below has something to iterate over during development.
 */
async function listLowTtlRegistrations(): Promise<LowTtlRegistration[]> {
  void getServer;
  return [];
}

/**
 * Signs and submits a `poke(keeper, registration_id)` invocation for a
 * single low-TTL registration.
 *
 * TODO: Build the contract invocation transaction with
 * `TransactionBuilder`, sign it with a `Keypair` derived from
 * `config.requireKeeperSecretKey()`, submit it via
 * `getServer().sendTransaction(...)`, and poll for confirmation.
 */
async function submitPoke(registration: LowTtlRegistration): Promise<void> {
  void Keypair;
  void registration;
  todoNotImplemented("submitPoke");
}

function todoNotImplemented(fnName: string): never {
  throw new Error(`${fnName} is not implemented yet — see TODO comments in src/index.ts`);
}

/**
 * One scan-and-poke cycle: find registrations at risk of TTL expiry and
 * submit a poke transaction for each one, sequentially, logging failures
 * without aborting the rest of the batch.
 */
async function scanAndPokeTargets(): Promise<void> {
  const registrations = await listLowTtlRegistrations();

  if (registrations.length === 0) {
    console.log("[keeper] no low-TTL registrations found this cycle");
    return;
  }

  for (const registration of registrations) {
    try {
      console.log(
        `[keeper] poking registration ${registration.registrationId} (ttl=${registration.currentTtl})`,
      );
      await submitPoke(registration);
    } catch (error) {
      console.error(`[keeper] failed to poke ${registration.registrationId}:`, error);
    }
  }
}

/**
 * Keeper Engine entry point: runs `scanAndPokeTargets` immediately, then on
 * a fixed interval defined by `KEEPER_POLL_INTERVAL_MS`.
 */
function main(): void {
  console.log(
    `[keeper] starting RentGelato keeper engine (interval=${config.pollIntervalMs}ms, ` +
      `contract=${config.contractId || "<unset>"})`,
  );

  void scanAndPokeTargets();

  setInterval(() => {
    void scanAndPokeTargets();
  }, config.pollIntervalMs);
}

main();
