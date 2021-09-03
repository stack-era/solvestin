import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
} from "@project-serum/associated-token";
import { BaseSignerWalletAdapter } from "@solana/wallet-adapter-base";
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
import { toast } from "react-toastify";
import { createTransaction } from "../solana/utils/createTransaction";
import { lamportsToSol } from "../solana/utils/lamportsToSol";

type WalletContextType = {
  balance: number;
  solBuckBalance: number;
  walletPK?: string;
  wallet: BaseSignerWalletAdapter | null;
  connected: boolean;
  isSolBuckAdded: boolean | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setActiveWallet: (wallet: BaseSignerWalletAdapter | null) => void;
  addSolBucksToAccount: () => Promise<void>;
  fetchSolBalance: () => void;
  fetchSolBucksBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType>({
  connected: false,
  wallet: null,
  balance: 0,
  solBuckBalance: 0,
  isSolBuckAdded: null,
  connect: async () => {},
  disconnect: async () => {},
  setActiveWallet: (wallet: BaseSignerWalletAdapter | null) => {},
  fetchSolBalance: () => {},
  fetchSolBucksBalance: async () => {},
  addSolBucksToAccount: async () => {},
});

export const useCustomWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("Wrap with WalletProvider");
  }

  return context;
};

// PROD
const SOL_BOCKS_PUB = new PublicKey(
  "FsrinjAhYaBKQieHhaJNGnepMS3RFHZJVjb1i26JhMdp"
);

// TEST
// const SOL_BOCKS_PUB = new PublicKey(
//   "Gmct6qXq8HvjNBJSc9QrySKZknbTqxz7QA9EXFjEn17e"
// );

export const CustomWalletProvider: FC = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<BaseSignerWalletAdapter | null>(null);
  const [walletPK, setWalletPK] = useState<string>();
  const [balance, setBalance] = useState(0);

  const [solBuckBalance, setSolBuckBalance] = useState(0);
  const [isSolBuckAdded, setIsSolBuckAdded] = useState<null | boolean>(null);

  const { connection } = useConnection();

  const connect = useCallback(async () => wallet?.connect(), [wallet]);
  const disconnect = useCallback(async () => wallet?.disconnect(), [wallet]);

  const fetchSolBucksBalance = useCallback(async () => {
    if (wallet?.publicKey) {
      try {
        const addr = await getAssociatedTokenAddress(
          wallet.publicKey,
          new PublicKey(SOL_BOCKS_PUB)
        );

        const res = await connection.getTokenAccountBalance(addr);

        if (res.value.uiAmount) {
          setSolBuckBalance(res.value.uiAmount);
        }

        setIsSolBuckAdded(true);
      } catch {
        setIsSolBuckAdded(false);
      }
    }
  }, [connection, wallet?.publicKey]);

  const addSolBucksToAccount = useCallback(async () => {
    if (wallet?.publicKey) {
      const instruction = await createAssociatedTokenAccount(
        wallet.publicKey,
        wallet.publicKey,
        new PublicKey(SOL_BOCKS_PUB)
      );

      const trn = await createTransaction({
        connection,
        wallet,
        instructions: [instruction],
      });

      if (trn) {
        setIsSolBuckAdded(true);
        fetchSolBucksBalance();
      }
    }
  }, [wallet, connection, fetchSolBucksBalance]);

  const fetchSolBalance = useCallback(() => {
    if (wallet?.publicKey) {
      connection
        .getBalance(wallet.publicKey)
        .then((balance = 0) => setBalance(lamportsToSol(balance)))
        .catch((error) => {
          // use toast message to show error
          toast.error(error.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    }
  }, [connection, wallet?.publicKey]);

  useEffect(() => {
    fetchSolBucksBalance();
    const inter = setInterval(() => fetchSolBucksBalance(), 5000);

    return () => clearInterval(inter);
  }, [fetchSolBucksBalance]);

  useEffect(() => {
    fetchSolBalance();
  }, [fetchSolBalance]);

  useEffect(() => {
    if (wallet) {
      setConnected(true);
      setWalletPK(wallet.publicKey?.toString());
    }
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        walletPK,
        setActiveWallet: setWallet,
        connected,
        connect,
        disconnect,
        balance,
        fetchSolBalance,
        fetchSolBucksBalance,
        solBuckBalance,
        isSolBuckAdded,
        addSolBucksToAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
