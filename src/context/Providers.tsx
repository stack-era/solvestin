import { ConnectionProvider } from "@solana/wallet-adapter-react";
import React, { FC } from "react";
import programConfig from "../config.json";
import { InvestProgramProvider } from "./Invest";
import { CustomWalletProvider } from "./Wallet";

const Providers: FC = ({ children }) => {
  return (
    <ConnectionProvider endpoint={programConfig.network}>
      <CustomWalletProvider>
        <InvestProgramProvider>{children} </InvestProgramProvider>
      </CustomWalletProvider>
    </ConnectionProvider>
  );
};

export default Providers;
