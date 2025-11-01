import { 
  createSolanaClient,
  type KeyPairSigner,
  generateKeyPairSigner,
  createTransaction,
  signTransactionMessageWithSigners,
  getExplorerLink,
  getSignatureFromTransaction
} from "gill";

import {
  loadKeypairSignerFromFile,
} from 'gill/node'

import {
    TOKEN_PROGRAM_ADDRESS as tokenProgram,
    getTokenMetadataAddress,
    getMintSize,
} from "gill/programs";

import {
  getCreateTokenInstructions,
} from "gill/programs/token"

 
const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet", // `mainnet`, `localnet`, etc
});
console.log("connected to devnet");

const signer:KeyPairSigner = await loadKeypairSignerFromFile();
console.log("signer:", signer.address);
  
const mint: KeyPairSigner = await generateKeyPairSigner();
const metadataAddress = await getTokenMetadataAddress(mint);
console.log(`\nMint Address: ${mint.address}\nMetadata Address: ${metadataAddress}\n`)


const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const space = getMintSize();

const instructions = getCreateTokenInstructions({
    mint: mint,
    feePayer: signer,
    mintAuthority: signer,
    updateAuthority: signer,
    decimals: 6,
    metadata: {
      name: "Anvils of Solana",
      symbol: "ANVL",
      uri: "https://github.com/0xherve/metadata/blob/main/AnvilsOfSolana/ANVL",
      isMutable: true,
    },
    metadataAddress: metadataAddress,
    tokenProgram: tokenProgram,
  })

const transaction = createTransaction({
  feePayer: signer,
  version: 'legacy',
  instructions,
  latestBlockhash,
})

const signedTransaction = await signTransactionMessageWithSigners(transaction);

const signature = await sendAndConfirmTransaction(signedTransaction);
 
console.log(
  "Explorer:",
  getExplorerLink({
    cluster: "devnet",
    transaction: signature,
  }),
);