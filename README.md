# hello-aiken

> Template to get started with aiken even quicker (... when using nix flakes and nvim)

## Get started

```command
git clone <this-repo> <proj-name>
cd <proj-name>
```
If you use `direnv`, then
```command
direnv allow
```
Else
```command
nix develop
```
The following executables are available 
- `aiken` 
- `edit` - nvim with additional config files to understand aiken files

Start a new aiken project 
```command
aiken new <owner>/<aiken-proj-name> 
```
For example, as here
```command
aiken new waalge/onchain
cd onchain
```

## Write aiken 

See [docs](https://aiken-lang.org/getting-started/hello-world) for the complete guide.

An aiken project has a `./lib/` and `./validators` directory, 
in which aiken (the builder) expects to find aiken code in modules with `.ak` extension.

## Build aiken

From aiken-project-root, (for example `./onchain/`)
```command
aiken build . 
```
Compiled validators, and other useful data, are output the `./assets/` directory.

## Offchain 

Offchain code is in the `./offchain` directory. 
It uses the Lucid framework. 

### Make a key

From project root, ensure there is a directory `./assets`.
From project root, run
```command
deno run --allow-net --allow-write ./offchain/mk_key.ts
```
By leaving the flags out, deno will ask you for permission where ever needed. 

### Get ada

Use the [cardano faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)
to addR ada to the address generated `./assets/key.addr` from the desired network.
Here we're going to use preprod.

(⚠ Currently the aiken docs from which we are following use the `preview` network ⚠)

## Get Blockfrost API key 

Get a free (or otherwise) api key from [Blockfrost](https://blockfrost.io/).

Follow the steps as instructed, and get an apikey for cardano preprod network. 
(⚠ Currently the aiken docs from which we are following use the `preview` network ⚠)
Dump the key into `./assets/blockfrost-preprod.txt`, so that `./assets` has now 
```sample
./assets
├── blockfrost-preprod.txt
├── key.addr
└── key.sk
```

### Lock funds tx

From project root, run 
```command
deno run --allow-net --allow-read --allow-write offchain/lock_tx.ts
```

### Unlock funds tx

```command
deno run --allow-net --allow-read --allow-write offchain/unlock_tx.ts
```

## Next steps

... 
