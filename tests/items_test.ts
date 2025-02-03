import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure that items can be minted with correct attributes",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet_1 = accounts.get("wallet_1")!;
    
    let block = chain.mineBlock([
      Tx.contractCall(
        "items",
        "mint-item",
        [
          types.ascii("sword"),
          types.uint(25),
          types.uint(1)
        ],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    assertEquals(block.height, 2);

    // Test item ownership
    block = chain.mineBlock([
      Tx.contractCall(
        "items",
        "owns-item",
        [types.uint(1)],
        wallet_1.address
      )
    ]);
    assertEquals(block.receipts[0].result, types.bool(true));

    // Test get attributes
    block = chain.mineBlock([
      Tx.contractCall(
        "items",
        "get-item-attributes",
        [types.uint(1)],
        wallet_1.address
      )
    ]);
    
    assertEquals(block.receipts[0].result.expectOk().expectSome(), {
      'item-type': types.ascii("sword"),
      'power': types.uint(25),
      'level-req': types.uint(1)
    });
  },
});
