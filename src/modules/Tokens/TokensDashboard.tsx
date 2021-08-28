import React from "react";
import SearchBar from "../../components/SearchBar";
import Image from "next/image";
import Holdings from "../../components/Holdings";

import { ShowBucketsContext } from "../../hooks/ShowBucketsContext";
import { useState } from "react";
import Statistics from "./components/Statistics";
import Chart from "./components/Chart";
import InvestmentDistribution from "./components/InvestmentDistribution";
import StreamingInvestment from "./components/StreamingInvestment";
import HistoryTables from "./components/HistoryTables";

interface TokensDashboardProps {
  token: any | undefined;
}

const TokensDashboard: React.FC<TokensDashboardProps> = ({ token }) => {
  return (
    <div className="" >
      <div className="flex">
        <div className="__tokens_tokensDashboard-hide-scroll w-[70%] overflow-y-scroll h-[100vh] pb-20 ">
          <SearchBar />
          <Statistics />
          <Chart />
          <InvestmentDistribution />
          <StreamingInvestment />
          <HistoryTables />
        </div>
        <div className="w-[30%]  ">
         
          <Holdings />
        </div>
      </div>
    </div>
  );
};

export default TokensDashboard;
