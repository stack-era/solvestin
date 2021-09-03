import { BaseSignerWalletAdapter } from "@solana/wallet-adapter-base";
import {
  AccountInfo,
  AccountMeta,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
// @ts-ignore
import soproxABI from "soprox-abi";
import { getErrorForTransaction } from "./utils/getErrorForTransaction";

type Schema = { key: string; type: string }[];

export abstract class BaseModal<
  K,
  S extends Partial<{ seedKey: number | string }> = Partial<{
    seedKey: number | string;
  }>,
  T extends keyof K = keyof K
> {
  abstract seed(args: S): string;
  abstract decode(info: AccountInfo<Buffer>): K;

  public async publicKeyFromSeed(
    ins: {
      walletPk: PublicKey;
      programId: PublicKey;
    } & S
  ) {
    const { walletPk, programId, seedKey } = ins;
    const seed = this.seed({ seedKey } as S);
    const publicKey = await PublicKey.createWithSeed(walletPk, seed, programId);
    return publicKey;
  }

  public decodeInfo(info: AccountInfo<Buffer>, schema: Schema): K {
    const buffer = Buffer.from(info.data);
    const layout = new soproxABI.struct(schema);
    layout.fromBuffer(buffer);

    return layout.value;
  }

  public encodeDataIntoInstruction<K = { [P in T]?: unknown }>(ins: {
    tag: number;
    schema: Schema;
    keys: AccountMeta[];
    programPk: PublicKey;
    data: K;
  }) {
    const { data, tag, keys, schema, programPk } = ins;
    const tagData = new soproxABI.u8(tag);
    const restData = new soproxABI.struct(schema, data);
    const bufferData = soproxABI.pack(tagData, restData);

    return new TransactionInstruction({
      keys,
      data: bufferData,
      programId: programPk,
    });
  }

  public async createRentAccount(ins: {
    seed: string;
    space: number;
    walletPk: PublicKey;
    programId: PublicKey;
    connection: Connection;
    newAccountPubkey: PublicKey;
    initialLamports?: number;
  }) {
    const {
      connection,
      programId,
      walletPk,
      newAccountPubkey,
      space,
      seed,
      initialLamports = 0,
    } = ins;

    const lamports = await connection.getMinimumBalanceForRentExemption(space);
    const instruction = SystemProgram.createAccountWithSeed({
      space,
      seed,
      lamports: lamports + initialLamports,
      programId,
      newAccountPubkey,
      fromPubkey: walletPk,
      basePubkey: walletPk,
    });

    return instruction;
  }

  public async createTransaction(ins: {
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
        const status = await connection.confirmTransaction(
          txid,
          "singleGossip"
        );

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
}
