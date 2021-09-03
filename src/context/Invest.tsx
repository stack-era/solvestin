import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import appConfig from "../config.json";
import { INTERVAL, Invest } from "../solana/invest";
import { solToLamports } from "../solana/utils/solToLamports";
import { useCustomWallet } from "./Wallet";

const APP_PROGRAM_KEY = new PublicKey(appConfig.programId);

type InvestContextType = {
  invests: Invest[];
  refetchAll(): Promise<void>;
  createInvest: (
    startTime: number,
    endTime: number,
    amount: number,
    interval: INTERVAL
  ) => Promise<string | undefined>;
};

const InvestContext = createContext<InvestContextType>({
  invests: [],
  refetchAll: async () => {},
  createInvest: async () => "",
});

export const useInvestProgram = () => {
  const context = useContext(InvestContext);
  if (!context) {
    throw new Error("Wrap with InvestProgramProvider");
  }

  return context;
};

export const InvestProgramProvider: FC = ({ children }) => {
  const [invests, setInvests] = useState<Invest[]>([]);

  const { wallet, fetchSolBalance, fetchSolBucksBalance } = useCustomWallet();
  const { connection } = useConnection();

  const fetchAll = useCallback(async () => {
    if (wallet?.publicKey) {
      const invests = await Invest.fetchAll(
        connection,
        wallet.publicKey,
        APP_PROGRAM_KEY
      );
      setInvests(invests);
    }
  }, [connection, wallet?.publicKey]);

  const refetchAll = useCallback(async () => {
    fetchSolBalance();
    await fetchAll();
  }, [fetchAll, fetchSolBalance]);

  const createInvest = useCallback(
    async (
      startTime: number,
      endTime: number,
      solAmount: number,
      interval: INTERVAL
    ) => {
      if (wallet) {
        const pdaAccountKey = await Invest.createInvest({
          wallet,
          connection,
          investData: {
            start_time: startTime,
            end_time: endTime,
            amount: solToLamports(solAmount),
            interval: interval,
          },
        });

        return pdaAccountKey;
      }
    },
    [connection, wallet]
  );

  useEffect(() => {
    if (wallet?.publicKey) {
      fetchAll().catch((error) => {
        // use toast message to show error
        // throw new Error(error.message) // comment this line if you are showing toast message
      });
    }
  }, [fetchAll, wallet?.publicKey]);

  return (
    <InvestContext.Provider
      value={{
        invests,
        refetchAll,
        createInvest,
      }}
    >
      {children}
    </InvestContext.Provider>
  );
};
