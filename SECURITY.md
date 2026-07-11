# Security Policy

Stellar Rent Gelato's smart contract holds user-deposited balances and controls TTL/state extension for registered footprints, so security issues here can directly affect user funds.

## Reporting a vulnerability

Please **do not open a public GitHub issue** for security vulnerabilities (e.g. anything that could drain or misdirect a deposited balance, let an unauthorized address register/poke/deregister someone else's target, or bypass `require_auth` checks).

Instead, report it privately via **[GitHub Security Advisories](../../security/advisories/new)** for this repository. Include:

- A description of the vulnerability and its potential impact.
- Steps to reproduce (a failing test against `contracts/rent_gelato` is ideal).
- Any suggested fix, if you have one.

We'll acknowledge new reports as soon as we can and aim to keep you updated as the issue is triaged and fixed. Coordinated disclosure is appreciated — please give us a chance to ship a fix before any public write-up.

## Scope

This policy covers:

- `contracts/rent_gelato` — the Soroban smart contract.
- `backend-keeper` — the keeper daemon, specifically around private key handling and transaction submission.
- `frontend` — specifically wallet-connection and transaction-signing flows.

Issues that are purely about code quality, missing features, or non-security bugs should go through the normal [issue tracker](../../issues) instead — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Supported versions

This project is pre-1.0 and under active development on `main`. Security fixes are only supported against the latest commit on `main`.
