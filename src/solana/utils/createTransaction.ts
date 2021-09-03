import { BaseSignerWalletAdapter } from "@solana/wallet-adapter-base";
import {
  Connection,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { getErrorForTransaction } from "./getErrorForTransaction";

export async function createTransaction(ins: {
  connection: Connection;
  wallet: BaseSignerWalletAdapter;
  instructions?: TransactionInstruction[];
  awaitConfirmation?: boolean;
}) {
  const {
    wallet,
    connection,
    instructions = [],
    awaitConfirmation = true,
  } = ins;

  const walletPk = wallet.publicKey;
  if (!walletPk) {
    throw new Error("The wallet does not have a public key");
  }

  let transaction = new Transaction({ feePayer: walletPk });
  for (const i of instructions) {
    transaction.add(i);
  }
  const recentBlock = await connection.getRecentBlockhash("max");
  transaction.recentBlockhash = recentBlock.blockhash;

  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();

  const txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
    preflightCommitment: "singleGossip",
  });

  if (awaitConfirmation) {
    try {
      const status = await connection.confirmTransaction(txid, "singleGossip");

      if (status.value.err) {
        throw new Error("error");
      }
    } catch {
      const errors = await getErrorForTransaction(connection, txid);
      console.error("Error executing transaction", errors);
    }
  }

  return txid;
}
