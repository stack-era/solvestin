import React from "react";
import Holdings from "../../components/Holdings";
import SearchBar from "../../components/SearchBar";
import Chart from "./components/Chart";
import HistoryTables from "./components/HistoryTables";
import InvestmentDistribution from "./components/InvestmentDistribution";
import Statistics from "./components/Statistics";
import StreamingInvestment from "./components/StreamingInvestment";

interface TokensDashboardProps {
  token: any | undefined;
}

const TokensDashboard: React.FC<TokensDashboardProps> = ({ token }) => {
  return (
    <div className="flex ">
      <div className="__tokens_tokensDashboard-hide-scroll w-[70%] overflow-y-scroll h-[100vh]  ">
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
  );
};

export default TokensDashboard;
