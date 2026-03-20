#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_create_and_get_swap() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    let swap_id = client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    assert_eq!(swap_id, 0);

    let swap = client.get_swap(&0_u32);
    assert_eq!(swap.creator, creator);
    assert_eq!(swap.offer_token, offer_token);
    assert_eq!(swap.offer_amount, 100_i128);
    assert_eq!(swap.request_token, request_token);
    assert_eq!(swap.request_amount, 200_i128);
    assert!(swap.active);
}

#[test]
fn test_cancel_swap() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    client.cancel_swap(&creator, &0_u32);

    let swap = client.get_swap(&0_u32);
    assert!(!swap.active);
}

#[test]
fn test_cancel_by_non_creator_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let other = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);

    let result = client.try_cancel_swap(&other, &0_u32);
    assert!(result.is_err());
}

#[test]
fn test_cancel_already_cancelled_fails() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    client.cancel_swap(&creator, &0_u32);

    let result = client.try_cancel_swap(&creator, &0_u32);
    assert!(result.is_err());
}

#[test]
fn test_get_all_swaps() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    client.create_swap(&creator, &offer_token, &50_i128, &request_token, &75_i128);

    let swaps = client.get_all_swaps();
    assert_eq!(swaps.len(), 2);
}

#[test]
fn test_get_active_swaps() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    // Create 3 swaps
    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    client.create_swap(&creator, &offer_token, &50_i128, &request_token, &75_i128);
    client.create_swap(&creator, &offer_token, &25_i128, &request_token, &30_i128);

    // Cancel one
    client.cancel_swap(&creator, &1_u32);

    // Should have 2 active swaps
    let active = client.get_active_swaps();
    assert_eq!(active.len(), 2);
}

#[test]
fn test_get_nonexistent_swap() {
    let env = Env::default();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let result = client.try_get_swap(&99_u32);
    assert!(result.is_err());
}

#[test]
fn test_accept_nonexistent_swap() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let acceptor = Address::generate(&env);
    let result = client.try_accept_swap(&acceptor, &99_u32);
    assert!(result.is_err());
}

#[test]
fn test_accept_inactive_swap() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let acceptor = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    client.cancel_swap(&creator, &0_u32);

    let result = client.try_accept_swap(&acceptor, &0_u32);
    assert!(result.is_err());
}

#[test]
fn test_swap_ids_increment() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(Contract, ());
    let client = ContractClient::new(&env, &contract_id);

    let creator = Address::generate(&env);
    let offer_token = Address::generate(&env);
    let request_token = Address::generate(&env);

    let id0 = client.create_swap(&creator, &offer_token, &100_i128, &request_token, &200_i128);
    let id1 = client.create_swap(&creator, &offer_token, &50_i128, &request_token, &75_i128);
    let id2 = client.create_swap(&creator, &offer_token, &25_i128, &request_token, &30_i128);

    assert_eq!(id0, 0);
    assert_eq!(id1, 1);
    assert_eq!(id2, 2);
}
