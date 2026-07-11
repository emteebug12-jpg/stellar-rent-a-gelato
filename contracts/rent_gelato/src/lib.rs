#![no_std]

mod errors;
mod types;

pub use errors::Error;
pub use types::{DataKey, GuardedKey};

use soroban_sdk::{contract, contractimpl, Address, BytesN, Env};

#[contract]
pub struct RentGelato;

#[contractimpl]
impl RentGelato {
    /// Deposit funds that may be used to preserve a target's TTL state.
    ///
    /// TODO(contributors): load the existing `DataKey::Balance(user)` entry
    /// (defaulting to `0`), add `amount` using `checked_add` to guard against
    /// `i128` overflow, reject non-positive amounts, and persist the result
    /// via `env.storage().instance().set(..)`. Auth is already enforced.
    pub fn deposit(env: Env, user: Address, amount: i128) {
        user.require_auth();
        let _ = (env, amount);
        todo!("Apply an overflow-checked i128 balance update for `user`")
    }

    /// Register a target footprint and return a deterministic registration id.
    ///
    /// TODO(contributors): derive a stable `BytesN<32>` id (e.g. hash of
    /// `user`, `target_address`, and the current ledger sequence), build a
    /// `GuardedKey { owner: user, target_address, threshold, active: true }`,
    /// persist it under `DataKey::Registration(id)`, append `id` to the
    /// `DataKey::RegistrationIds` list, and reject duplicate registrations.
    pub fn register_target(
        env: Env,
        user: Address,
        target_address: Address,
        threshold: u32,
    ) -> BytesN<32> {
        user.require_auth();
        let _ = (env, target_address, threshold);
        todo!("Persist a GuardedKey registration and compute a deterministic id")
    }

    /// Allow the keeper to refresh a registration before the TTL threshold is crossed.
    ///
    /// TODO(contributors): load the `GuardedKey` for `registration_id`,
    /// confirm it exists and is `active`, extend the underlying ledger
    /// entry's TTL (`env.storage().persistent().extend_ttl(..)` on the
    /// target footprint), and debit the owner's balance to compensate the
    /// keeper. Return `Error::RegistrationNotFound` semantics via a
    /// `Result<(), Error>` once error propagation is wired up.
    pub fn poke(env: Env, keeper: Address, registration_id: BytesN<32>) {
        keeper.require_auth();
        let _ = (env, registration_id);
        todo!("Verify the registration and submit the TTL preservation action")
    }
}

#[cfg(test)]
mod test;
