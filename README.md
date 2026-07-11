# Stellar Rent Gelato 🍦

**Automated, incentivized TTL management for Soroban smart contract state.**

Stellar Rent Gelato is an open-source "keep-alive" layer for Soroban: it lets anyone fund a keeper network to automatically extend the lifetime of on-chain data before it expires, so contracts and dApps never lose state to archival.

## The problem it solves

Soroban uses a **state expiration (rent) model**: every contract instance and every piece of `persistent`/`temporary` storage is stored with a **time-to-live (TTL)**, measured in ledgers. When an entry's TTL hits zero, it is **archived** — it stops being readable/writable on the live ledger until it is explicitly restored (and, for `temporary` storage, it is deleted outright).

This is a deliberate, healthy design: it keeps the Stellar ledger's active state small and keeps fees predictable, instead of every contract paying forever for storage it wrote once. But it pushes a real operational burden onto every contract author:

- Contracts and dApps must remember to call `extend_ttl` on every entry that matters, on a schedule, forever — or risk that data (balances, NFTs, DAO votes, oracle prices, escrow state, subscription records, etc.) silently going dark.
- A dApp with no active users for a while can come back to find its own state has expired, breaking reads until someone pays to restore it.
- There is no standard, reusable, incentive-aligned way to outsource "keep my contract's data alive" — every team either builds a bespoke cron job with a hot wallet, or hopes they remember before it's too late.

**Rent Gelato turns TTL maintenance into a market**, borrowing the "Gelato Network" pattern from EVM chains (automated, keeper-executed transactions) and adapting it to Soroban's storage/TTL primitives:

1. A user (or protocol) **deposits** funds into the RentGelato contract to pay for future upkeep.
2. They **register** a target footprint — their own contract's storage, an NFT record, a DAO's state, anything with a TTL — along with a TTL threshold that defines "getting low."
3. An open, permissionless network of **keepers** continuously scans registered targets. When one drops below its threshold, any keeper can call `poke`, which extends the TTL on-chain and earns a fee debited from the owner's deposited balance.

The result: contract state that would otherwise require manual babysitting stays alive indefinitely, paid for transparently out of a balance the owner tops up, maintained by whichever keeper gets there first — no centralized operator, no single point of failure.

## Why this matters for the Stellar/Soroban ecosystem

- **Removes a sharp edge from Soroban's rent model.** State expiration is one of the first things that surprises teams building on Soroban; Rent Gelato gives the ecosystem a shared, audited answer instead of N bespoke ones.
- **Composable primitive, not a point solution.** Any contract, index, or off-chain service that cares about a specific ledger footprint can register it — DeFi protocols protecting pool state, NFT platforms protecting metadata, DAOs protecting proposal/vote records, oracle feeds, subscription/escrow systems.
- **Keeper economics are permissionless.** Anyone can run a keeper and earn fees for pokes — there's no whitelist, matching Stellar/Soroban's open validator/operator ethos.
- **A good showcase of core Soroban primitives.** The project exercises `Address::require_auth`, `#[contracttype]` storage modeling, persistent-entry TTL extension, and signed `i128` accounting — useful reference code for anyone learning to build production Soroban contracts.

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

## Project status

This repository is a working, from-scratch scaffold: the architecture, storage layout, and entry-point signatures are settled, and the code builds/typechecks cleanly end-to-end — but the core business logic behind `deposit`, `register_target`, and `poke`, along with the frontend's RPC calls and the keeper's scan/poke loop, is intentionally left open (`todo!()` in Rust, `// TODO` in TypeScript) for contributors to implement.

Want to help? See [CONTRIBUTING.md](CONTRIBUTING.md) for the full task list and how to get set up.

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
