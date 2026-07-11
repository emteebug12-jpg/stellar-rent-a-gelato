use soroban_sdk::{contracttype, Address, BytesN};

/// Storage keys used by the RentGelato contract.
///
/// `#[contracttype]` makes this enum serializable as a Soroban storage key,
/// so each variant addresses a distinct ledger entry.
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    /// Tracks the signed `i128` balance for a user.
    Balance(Address),
    /// Tracks an individual registration by its deterministic identifier.
    Registration(BytesN<32>),
    /// Tracks the ordered list of registration ids known to the contract.
    RegistrationIds,
}

/// Describes a single registered TTL-preservation target and the guard
/// conditions the keeper network must respect when poking it.
///
/// TODO(contributors): this is the shape `register_target` should persist
/// under `DataKey::Registration(id)`, and `poke` should read and validate
/// against. Extend the fields as keeper economics require (for example a
/// `last_poked_ledger` or `reward` field).
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct GuardedKey {
    /// The user who registered this target and owns its funding balance.
    pub owner: Address,
    /// The footprint/address being kept alive via periodic TTL extension.
    pub target_address: Address,
    /// The minimum ledger-count TTL threshold before a poke is required.
    pub threshold: u32,
    /// Whether the registration is currently active and eligible for pokes.
    pub active: bool,
}
