# Stellar Rent Gelato

A decentralized state-preservation and automated TTL-extension engine for Soroban. Users register a target ledger footprint and fund it; an open, incentivized keeper network "pokes" the registration before its TTL expires, keeping the on-chain state alive indefinitely without manual intervention.

This repository is scaffolded for the **Drips Stellar Wave Program**: the structure, types, and entry points are in place, and the core business logic is intentionally left as `todo!()` / TODO hooks for contributors to pick up during the sprint. See [CONTRIBUTING.md](CONTRIBUTING.md) for the scoped task list.

## Architecture

```
contracts/rent_gelato/   Soroban smart contract (no_std Rust)
frontend/                Next.js 15 App Router dashboard (Freighter wallet integration)
backend-keeper/          Node.js/TypeScript keeper daemon (scans + pokes low-TTL registrations)
```

### Smart contract (`contracts/rent_gelato`)

- `deposit(user, amount)` — credits a user's overflow-checked `i128` balance used to fund keeper pokes.
- `register_target(user, target_address, threshold) -> BytesN<32>` — registers a footprint to keep alive, keyed by a deterministic id.
- `poke(keeper, registration_id)` — called by a keeper to extend a registered footprint's TTL and draw down the owner's balance.

Storage types (`DataKey`, `GuardedKey`) live in `src/types.rs`; the error taxonomy is in `src/errors.rs`.

### Frontend (`frontend/`)

Next.js dashboard for connecting Freighter, registering targets, and inspecting live TTL health. `lib/gelatoClient.ts` is the placeholder boundary for the type-safe contract client generated via `npm run generate:bindings`.

### Backend keeper (`backend-keeper/`)

A standalone daemon (`src/index.ts`) that polls Soroban RPC on an interval, finds registrations below a low-TTL threshold, and submits `poke` transactions signed by a dedicated keeper account.

## Getting started

```bash
# Contracts
cargo check
cargo test -p rent-gelato

# Frontend
cd frontend && npm install && npm run dev

# Keeper daemon
cd backend-keeper && npm install && npm run dev
```

Copy each `.env.example` (`frontend/.env.example`, `backend-keeper/.env.example`) to `.env` and fill in RPC/contract values before running the frontend or keeper.

## License

MIT — see [LICENSE](LICENSE).
