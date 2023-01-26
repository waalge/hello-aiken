import {
  Blockfrost,
  C,
  Constr,
  Data,
  Lucid,
  SpendingValidator,
  TxHash,
  fromHex,
  toHex,
  fromText,
} from "https://deno.land/x/lucid@0.8.8/mod.ts";
import * as cbor from "https://deno.land/x/cbor@v1.4.1/index.js";

const blockfrostApiKey = await Deno.readTextFile("./assets/blockfrost-preprod.txt");

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    blockfrostApiKey,
  ),
  "Preprod",
);
 
lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./assets/key.sk"));
 
const validator = await readValidator("./onchain/assets/greet_and_sign/spend/script.cbor");
 
// --- Supporting functions
 
async function readValidator(filepath: String): Promise<SpendingValidator> {
  return {
    type: "PlutusV2",
    script: toHex(cbor.encode(fromHex(await Deno.readTextFile(filepath)))),
  };
}

const txHash = await Deno.readTextFile("./assets/tx_id.txt");

const utxo = { 
    txHash: txHash.trim(), //"ac34f05c86c0a2280504825367099a7bb6661033f3c4302b0bd15784be0f3f78", 
    //txHash: "5020969902ac371c7ef019f574c8fbc92beb310e9fa1b8ce6256e0df24b54980",
    outputIndex: 0 
};
 
const redeemer = Data.to(new Constr(0, [fromText("Hello, World!")]));
 
const txUnlock = await unlock(utxo, { from: validator, using: redeemer });
 
await lucid.awaitTx(txUnlock);
 
console.log(`1 ADA recovered from the contract
    Tx ID: ${txUnlock}
    Redeemer: ${redeemer}
`);
 
// --- Supporting functions
 
async function unlock(ref, { from, using }): Promise<TxHash> {
  const [utxo] = await lucid.utxosByOutRef([ref]);
 
  const tx = await lucid
    .newTx()
    .collectFrom([utxo], using)
    .addSigner(await lucid.wallet.address())
    .attachSpendingValidator(from)
    .complete();
 
  const signedTx = await tx
    .sign()
    .complete();
 
  return signedTx.submit();
}
