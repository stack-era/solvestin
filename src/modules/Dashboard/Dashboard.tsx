import React from "react";

import Statistics from "./components/Statistics";
import Holdings from "../../components/Holdings";
import Chart from "./components/Chart";
import Allinvestments from "./components/Allinvestments";
import InvestmentBuckets from "./components/InvestmentBuckets";
import { useShowBucketsContext } from "../../hooks/ShowBucketsContext";

import SearchBar from "../../components/SearchBar";
import { useEffect } from "react";
import { useActiveWindowContext } from "../../hooks/ActiveWindowContext";


const Dashboard: React.FC = () => {
  const { showBuckets, setShowBuckets } = useShowBucketsContext();
  const { activeWindow, setActiveWindow } = useActiveWindowContext();



  return (
    <div>
      <div className="flex  ">
        <div className="w-[70%] ">
          <SearchBar />
          <Statistics />

          <Chart />
          <Allinvestments />
        </div>
        <div className="w-[30%]   ">
          <Holdings />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
