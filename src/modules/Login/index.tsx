import { WalletError } from "@solana/wallet-adapter-base";
import {
  useLocalStorage,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  getPhantomWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import dynamic from "next/dynamic";
// import { Login } from "../modules/Login/Login";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { useAuthContext } from "../../auth/authContext";
import SideNav from "../SideNav/SideNav";

const Login = dynamic(() => import("./Login"), { ssr: false });

const Home = () => {
  const { isAuthenticated, setAuthentication } = useAuthContext();
  const router = useRouter();
  const {} = useWallet();
  const wallets = useMemo(() => [getPhantomWallet(), getSolletWallet()], []);
  const onError = useCallback((error: WalletError) => {
    console.log(
      "error",
      error.message ? `${error.name}: ${error.message}` : error.name
    );
    console.log("err", error);
  }, []);
  const [localStorageValue, setLocalStorage] = useLocalStorage(
    "solmate-pb",
    ""
  );

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated]);

  return (
    <WalletProvider
      localStorageKey="solmate-pb"
      autoConnect={true}
      onError={onError}
      wallets={wallets}
    >
      <div className="flex h-full">
        <div className="w-[6%]  border-r border-[#2B2B2E]  ">
          <SideNav />
        </div>
        <div className="w-[94%] ">
          <Login />
        </div>
      </div>
    </WalletProvider>
  );
};

export default Home;
