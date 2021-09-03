import { BaseSignerWalletAdapter } from "@solana/wallet-adapter-base";
import {
  AccountInfo,
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import programConfig from "../config.json";
import { BaseModal } from "./base";

const APP_PROGRAM_KEY = new PublicKey(programConfig.programId);

const INVEST_SEED = "invest";
const INVEST_ENCODE_SCHEMA = [
  { key: "start_time", type: "u64" },
  { key: "end_time", type: "u64" },
  { key: "amount", type: "u64" },
  { key: "interval", type: "u64" },
];

const INVEST_DECODE_SCHEMA = [
  ...INVEST_ENCODE_SCHEMA,
  { key: "withdrawal_count", type: "u64" },
  { key: "withdrawn", type: "u64" },
  { key: "sender", type: "[u8;32]" },
];

const INVESTING_ACCOUNT_SIZE = 8 + 8 + 8 + 8 + 8 + 8 + 1 * 32;

export enum INTERVAL {
  DAY,
  WEEK,
  MONTH,
}

export const intervalString = (intr: INTERVAL) => {
  return intr === INTERVAL.DAY
    ? "Day"
    : intr === INTERVAL.WEEK
    ? "Week"
    : "Month";
};

type InvestData = {
  start_time: number;
  end_time: number;
  amount: number;
  interval: INTERVAL;
  withdrawal_count?: number;
  withdrawn?: number;
  sender?: string;
};

const u8ArrayToPubKey = (u8Array: number[]) => {
  return new PublicKey(new Uint8Array(u8Array));
};

class InvestModal extends BaseModal<InvestData, { seedKey: number }> {
  seed({ seedKey }: { seedKey: number }) {
    return `${INVEST_SEED}_${seedKey}`;
  }

  decode(info: AccountInfo<Buffer>) {
    const value = super.decodeInfo(info, INVEST_DECODE_SCHEMA);

    const senderU8 = value.sender as unknown as number[];

    return {
      start_time: Number(value.start_time),
      end_time: Number(value.end_time),
      amount: Number(value.amount),
      withdrawal_count: Number(value.withdrawal_count),
      withdrawn: Number(value.withdrawn),
      sender: u8ArrayToPubKey(senderU8).toString(),
      interval: Number(value.interval),
    };
  }
}

export class Invest {
  private static STARING_INDEX = 0;
  private static NEXT_INDEX = -1;

  private constructor(public publicKey: PublicKey, public data: InvestData) {}

  private static keys(walletPk: PublicKey, investPda: PublicKey) {
    return [
      { pubkey: walletPk, isSigner: true, isWritable: true },
      { pubkey: investPda, isSigner: false, isWritable: true },
    ];
  }

  public static async fetch(
    conn: Connection,
    walletPk: PublicKey,
    programId: PublicKey,
    index: number
  ) {
    const investModal = new InvestModal();
    const investPda = await investModal.publicKeyFromSeed({
      walletPk,
      programId,
      seedKey: index,
    });

    const investInfo = await conn.getAccountInfo(investPda);

    if (!investInfo) {
      return null;
    }

    const investData = investModal.decode(investInfo);
    return new Invest(investPda, investData);
  }

  public static async fetchAll(
    conn: Connection,
    walletPk: PublicKey,
    programId: PublicKey
  ) {
    const invests = [];

    let index = Invest.STARING_INDEX;

    while (true) {
      // Fetch the Invest at index
      const invest = await Invest.fetch(conn, walletPk, programId, index);

      if (invest) {
        invests.push(invest);
      } else {
        Invest.NEXT_INDEX = index;
        break;
      }

      // Increment index to search for next invest
      index++;
    }

    return invests;
  }

  // create Empty Account (optionally set initial data)
  static async createInvest(ins: {
    wallet: BaseSignerWalletAdapter;
    connection: Connection;
    investData?: Omit<InvestData, "index">;
  }) {
    const { wallet, connection, investData } = ins;

    const walletPk = wallet.publicKey;
    if (!walletPk) {
      throw new Error("The wallet does not have a public key");
    }

    const initialLamports = investData?.amount;

    if (!initialLamports) {
      throw new Error("Amount cant be empty");
    }

    console.log("==== NEXT_INDEX", Invest.NEXT_INDEX);

    if (Invest.NEXT_INDEX === -1) {
      throw new Error(
        "Before init you have to fetchAll invests, fetchAll will set Next index"
      );
    }

    const investModal = new InvestModal();
    const seed = investModal.seed({ seedKey: Invest.NEXT_INDEX });
    const investPda = await investModal.publicKeyFromSeed({
      seedKey: Invest.NEXT_INDEX,
      walletPk,
      programId: APP_PROGRAM_KEY,
    });

    const instructions: TransactionInstruction[] = [];

    // create an empty account
    const emptyAccIns = await investModal.createRentAccount({
      seed,
      walletPk,
      programId: APP_PROGRAM_KEY,
      connection,
      space: INVESTING_ACCOUNT_SIZE,
      newAccountPubkey: investPda,
      initialLamports,
    });

    instructions.push(emptyAccIns);

    if (investData) {
      // create initial data instruction
      const dataIns = investModal.encodeDataIntoInstruction({
        keys: Invest.keys(walletPk, investPda),
        tag: 0,
        schema: INVEST_ENCODE_SCHEMA,
        programPk: APP_PROGRAM_KEY,
        data: {
          start_time: investData.start_time,
          end_time: investData.end_time,
          amount: investData.amount,
          interval: investData.interval,
        },
      });

      instructions.push(dataIns);
    }

    await investModal.createTransaction({
      wallet,
      connection,
      instructions,
    });

    return investPda.toString();
  }
}
