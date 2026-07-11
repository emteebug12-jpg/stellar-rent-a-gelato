# Contributing to Stellar Rent Gelato

Thanks for taking a look — this project exists specifically so open-source contributors have a well-scoped, ready-to-build Soroban project to sink their teeth into. You don't need prior context on the codebase to be productive here: the architecture is settled, every layer builds cleanly, and each open task below is small enough to finish and PR on its own.

If anything in this doc is unclear, that's a bug in the doc — open an issue and we'll fix it.

## Before you start

1. **Read the [README](README.md)** for the "why" — what problem Rent Gelato solves in the Soroban ecosystem and how the three layers (contract, frontend, keeper) fit together.
2. **Pick an issue.** All open work is tracked as [GitHub Issues](../../issues), each labeled by area (`contracts`, `frontend`, `keeper`, `infra`, `security`, `testing`) and, where applicable, [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for a gentler entry point. Every issue names the exact file/function to touch and lists acceptance criteria — you shouldn't need to reverse-engineer scope.
3. **Comment on the issue before starting** so two people don't build the same thing in parallel. If it's been quiet for a while and you want it, just say so and start.
4. **Keep PRs scoped to one issue.** Small, single-purpose diffs get reviewed and merged fastest, especially during a sprint — resist the urge to also refactor or fix unrelated things you notice along the way (open a new issue for those instead).

## Local setup

You only need to set up the layer(s) you're touching.

### Contracts (Rust / Soroban)

Requires a recent stable Rust toolchain with the `wasm32-unknown-unknown` target.

```bash
rustup target add wasm32-unknown-unknown
cargo check --workspace
cargo test -p rent-gelato
```

### Frontend (Next.js)

Requires Node.js 20+.

```bash
cd frontend
cp .env.example .env        # fill in RPC URL / contract id as needed
npm install
npm run dev                 # http://localhost:3000
npm run build                # production build check before opening a PR
```

You'll also want the [Freighter](https://www.freighter.app/) browser extension installed (testnet mode) to exercise wallet-connected flows.

### Backend keeper (Node.js daemon)

```bash
cd backend-keeper
cp .env.example .env        # never put a real mainnet secret key here
npm install
npm run dev
```

## What a good PR looks like

- [ ] Addresses exactly one issue (link it in the PR description with `Closes #N`).
- [ ] Includes or updates tests for the behavior you added (see the `testing`-labeled issues if you're not sure what "enough" coverage looks like here).
- [ ] Passes the relevant check locally before you push:
  - Contracts: `cargo check --workspace && cargo test -p rent-gelato`
  - Frontend: `npm run build` (or `npm run typecheck` if you added one)
  - Keeper: `npm run typecheck`
- [ ] Doesn't touch files outside your issue's scope (config/lockfile changes from `npm install`/`cargo build` are fine and expected).
- [ ] Has a short PR description explaining *why*, not just *what* — the diff already shows what changed.

## Conventions

- **Contracts**: `no_std` Rust, `soroban-sdk` 22.x. Keep `overflow-checks = true` in the workspace root `Cargo.toml` — don't move it back into the member manifest. Use `Address::require_auth()` on every state-mutating entry point, and prefer extending the `Error` taxonomy in `errors.rs` over `panic!`/`unwrap` for anything a caller could plausibly trigger.
- **Frontend**: Next.js App Router, Tailwind. Keep wallet/session state in components; keep `lib/` free of React so it stays unit-testable.
- **Backend keeper**: plain Node.js/TypeScript, no framework. Prefer small, sequential async functions over hidden concurrency — the keeper loop should stay easy to reason about under retries and partial failures.
- **Commits**: conventional-ish prefixes (`feat:`, `fix:`, `test:`, `docs:`, `chore:`) scoped to the layer, e.g. `feat(contracts): ...`, `fix(frontend): ...` — see recent commit history for examples.

## Reporting bugs / proposing new work

Found a bug, or see a gap that isn't covered by an existing issue? Open a new issue rather than folding it into an unrelated PR — small, well-described issues are what keeps this project easy for the next contributor to pick up too.

Found a security-relevant issue (e.g. something that could drain deposited balances or let an unauthorized address extend/poke someone else's registration)? Please see [SECURITY.md](SECURITY.md) instead of opening a public issue.

## License

By contributing, you agree your contributions are licensed under this repository's [MIT License](LICENSE).
