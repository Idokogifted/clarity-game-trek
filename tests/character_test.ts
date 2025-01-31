import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that characters can be created with correct initial stats",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall("character", "create-character", [], wallet_1.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);
    
    block = chain.mineBlock([
      Tx.contractCall("character", "get-character-stats", [types.uint(1)], wallet_1.address)
    ]);
    
    assertEquals(block.receipts[0].result.expectOk().expectTuple(), {
      health: types.uint(100),
      attack: types.uint(10),
      defense: types.uint(10),
      level: types.uint(1),
      experience: types.uint(0)
    });
  },
});
