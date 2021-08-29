import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
// import { Login } from "../modules/Login/Login";

import { useRouter } from "next/router";
import { useEffect, useMemo, useCallback } from "react";

const Login = dynamic(() => import("./Login"), { ssr: false });

import { WalletError } from "@solana/wallet-adapter-base";
import {
  useWallet,
  WalletProvider,
  useLocalStorage,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import {
  getPhantomWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";

import { clusterApiUrl } from "@solana/web3.js";
import { useAuthContext } from "../../auth/authContext";
import SideNav from "../SideNav/SideNav";

const Home = () => {
  const { isAuthenticated, setAuthentication } = useAuthContext();
  const router = useRouter();

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [getSolletWallet(), getPhantomWallet()], []);
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
    <ConnectionProvider endpoint={endpoint}>
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
    </ConnectionProvider>
  );
};

export default Home;
