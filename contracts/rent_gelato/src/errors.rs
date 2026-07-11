use soroban_sdk::contracterror;

/// Comprehensive error taxonomy for the RentGelato contract.
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    /// The caller is not authorized for the requested action.
    NotAuthorized = 1,
    /// The provided balance movement would underflow or overflow.
    InsufficientBalance = 2,
    /// The TTL threshold is invalid or unresolved.
    InvalidThreshold = 3,
    /// The referenced registration could not be found.
    RegistrationNotFound = 4,
    /// The target footprint already exists.
    RegistrationExists = 5,
    /// The requested action is not supported by the current contract state.
    UnsupportedOperation = 6,
}
