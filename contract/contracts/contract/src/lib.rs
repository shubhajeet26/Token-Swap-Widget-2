#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, Vec};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Swap(u32), // swap_id -> SwapOffer
    SwapCount, // total swaps created
}

#[contracttype]
#[derive(Clone)]
pub struct SwapOffer {
    pub creator: Address,
    pub offer_token: Address,
    pub offer_amount: i128,
    pub request_token: Address,
    pub request_amount: i128,
    pub active: bool,
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    /// Anyone can create a swap offer.
    /// - offerer gives `offer_amount` of `offer_token`
    /// - in return, they want `request_amount` of `request_token`
    pub fn create_swap(
        env: Env,
        creator: Address,
        offer_token: Address,
        offer_amount: i128,
        request_token: Address,
        request_amount: i128,
    ) -> u32 {
        creator.require_auth();

        let count_key = DataKey::SwapCount;
        let next_id: u32 = env.storage().instance().get(&count_key).unwrap_or(0);

        let offer = SwapOffer {
            creator: creator.clone(),
            offer_token,
            offer_amount,
            request_token,
            request_amount,
            active: true,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Swap(next_id), &offer);
        env.storage().instance().set(&count_key, &(next_id + 1));

        next_id
    }

    /// Anyone can accept an active swap.
    /// - Acceptor's `request_token` is transferred to the creator
    /// - Creator's `offer_token` is transferred to the acceptor
    pub fn accept_swap(env: Env, acceptor: Address, swap_id: u32) {
        acceptor.require_auth();

        let key = DataKey::Swap(swap_id);
        let mut offer: SwapOffer = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("swap not found"));

        assert!(offer.active, "swap not active");

        // Transfer request token: acceptor -> creator
        token::Client::new(&env, &offer.request_token).transfer(
            &acceptor,
            &offer.creator,
            &offer.request_amount,
        );

        // Transfer offer token: creator -> acceptor
        token::Client::new(&env, &offer.offer_token).transfer(
            &offer.creator,
            &acceptor,
            &offer.offer_amount,
        );

        offer.active = false;
        env.storage().persistent().set(&key, &offer);
    }

    /// Creator can cancel their own active swap.
    pub fn cancel_swap(env: Env, caller: Address, swap_id: u32) {
        caller.require_auth();

        let key = DataKey::Swap(swap_id);
        let mut offer: SwapOffer = env
            .storage()
            .persistent()
            .get(&key)
            .unwrap_or_else(|| panic!("swap not found"));

        assert!(offer.creator == caller, "not the creator");
        assert!(offer.active, "swap not active");

        offer.active = false;
        env.storage().persistent().set(&key, &offer);
    }

    /// Read a single swap by ID.
    pub fn get_swap(env: Env, swap_id: u32) -> SwapOffer {
        env.storage()
            .persistent()
            .get(&DataKey::Swap(swap_id))
            .unwrap_or_else(|| panic!("swap not found"))
    }

    /// Read all swaps (up to 1000 for gas safety).
    pub fn get_all_swaps(env: Env) -> Vec<SwapOffer> {
        let total: u32 = env
            .storage()
            .instance()
            .get(&DataKey::SwapCount)
            .unwrap_or(0);

        let limit = if total > 1000 { 1000 } else { total };
        let mut result = Vec::new(&env);

        let mut i = 0u32;
        while i < limit {
            if let Some(swap) = env
                .storage()
                .persistent()
                .get::<_, SwapOffer>(&DataKey::Swap(i))
            {
                result.push_back(swap);
            }
            i += 1;
        }
        result
    }

    /// Get only active swaps.
    pub fn get_active_swaps(env: Env) -> Vec<SwapOffer> {
        let total: u32 = env
            .storage()
            .instance()
            .get(&DataKey::SwapCount)
            .unwrap_or(0);

        let limit = if total > 1000 { 1000 } else { total };
        let mut result = Vec::new(&env);

        let mut i = 0u32;
        while i < limit {
            if let Some(swap) = env
                .storage()
                .persistent()
                .get::<_, SwapOffer>(&DataKey::Swap(i))
            {
                if swap.active {
                    result.push_back(swap);
                }
            }
            i += 1;
        }
        result
    }
}

mod test;
