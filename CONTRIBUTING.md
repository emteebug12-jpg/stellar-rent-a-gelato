# Contributing (Drips Stellar Wave sprint)

This repo is scaffolded end-to-end so contributors can pick up a scoped task without needing to design the surrounding architecture first. Every open task below corresponds to a `todo!()` (Rust) or `// TODO` (TypeScript) hook already in the code.

## Task list

| # | Layer | Location | Task |
|---|-------|----------|------|
| 1 | Contract | `contracts/rent_gelato/src/lib.rs` — `deposit` | Apply an overflow-checked `i128` balance update under `DataKey::Balance(user)`, rejecting non-positive amounts. |
| 2 | Contract | `contracts/rent_gelato/src/lib.rs` — `register_target` | Derive a deterministic `BytesN<32>` id, persist a `GuardedKey` under `DataKey::Registration(id)`, and append the id to the registration list. Reject duplicates. |
| 3 | Contract | `contracts/rent_gelato/src/lib.rs` — `poke` | Load and validate the `GuardedKey`, extend the target footprint's TTL, and debit the owner's balance to compensate the keeper. |
| 4 | Frontend | `frontend/lib/gelatoClient.ts` — `fetchContractTTL` | Replace the mock return value with a real Soroban RPC `getLedgerEntries` call and derive TTL from `liveUntilLedgerSeq`. |
| 5 | Frontend | `frontend/scripts/generate-bindings.mjs` | Wire up actual `stellar contract bindings typescript` (or equivalent) generation instead of the README placeholder. |
| 6 | Backend keeper | `backend-keeper/src/index.ts` — `listLowTtlRegistrations` | Query the contract's registration list over RPC and filter by remaining TTL. |
| 7 | Backend keeper | `backend-keeper/src/index.ts` — `submitPoke` | Build, sign (via `config.requireKeeperSecretKey()`), and submit the `poke` invocation transaction; poll for confirmation. |

## Conventions

- **Contracts**: `no_std` Rust, `soroban-sdk` 22.x. Keep `overflow-checks = true` in the workspace root `Cargo.toml` — don't move it back into the member manifest. Use `Address::require_auth()` for any state-mutating entry point.
- **Frontend**: Next.js App Router, Tailwind. Keep wallet/session state in components; keep `lib/` free of React so it stays testable.
- **Backend keeper**: plain Node.js/TypeScript, no framework. Prefer small, sequential async functions over hidden concurrency — the keeper loop should stay easy to reason about under retries.

## Workflow

1. Pick an open task above (or comment on its tracking issue if one exists) so work isn't duplicated.
2. Keep PRs scoped to a single task/hook — small, reviewable diffs move faster during a sprint.
3. Add or update tests alongside logic changes (`contracts/rent_gelato/src/test.rs` currently only has a placeholder `#[ignore]` stub).
4. Run the relevant build/check command from the [README](README.md) before opening a PR.
