import React from "react";
import Holdings from "../../components/Holdings";
import SearchBar from "../../components/SearchBar";
import { useActiveWindowContext } from "../../hooks/ActiveWindowContext";
import { useShowBucketsContext } from "../../hooks/ShowBucketsContext";
import Allinvestments from "./components/Allinvestments";
import Chart from "./components/Chart";
import Statistics from "./components/Statistics";

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
