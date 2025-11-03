import {
  type KeyPairSigner,
  address,
  createSolanaClient,
  signTransactionMessageWithSigners,
} from "gill"

import {
  loadKeypairSignerFromFile,
} from "gill/node"

import {
  getAssociatedTokenAccountAddress,
  getCreateAssociatedTokenInstruction,
  getMintToInstruction,
  buildMintTokensTransaction,
  TOKEN_PROGRAM_ADDRESS,
  SYSTEM_PROGRAM_ADDRESS
} from 'gill/programs'


const signer: KeyPairSigner = await loadKeypairSignerFromFile();
  const mint = address("AMWqxSqcKDMycQdeLqvTfJ68S6VxpGa2xXYdHKiVnNch");

const { rpc, sendAndConfirmTransaction } = createSolanaClient({
  urlOrMoniker: "devnet",
});

const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

const ataAddress = await getAssociatedTokenAccountAddress(
  mint,
  signer.address,
  TOKEN_PROGRAM_ADDRESS,
  )


console.log(`Create an Associated Token Address:${ataAddress}`)

const transaction = await buildMintTokensTransaction({
    feePayer: signer,
    mint,
    mintAuthority: signer,
    destination: signer.address,
    amount: 1000000000,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
    latestBlockhash
})

const signedTransaction = await signTransactionMessageWithSigners(transaction);

const signature = await sendAndConfirmTransaction(signedTransaction);
 
console.log(
  "Explorer:",
  `https://explorer.solana.com/tx/${signature}?cluster=devnet`
);
