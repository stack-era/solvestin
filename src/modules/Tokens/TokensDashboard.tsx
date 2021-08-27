import React from "react";
import SearchBar from "../../components/SearchBar";
import Image from "next/image";
import Holdings from "../../components/Holdings";
import BellIcon from "../../assets/icons/Bell-icon.svg";
import AvatarIcon from "../../assets/icons/Avatar-icon.svg";
import DownArrow from "../../assets/icons/Down-Arrow-icon.svg";
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
  const [showBuckets, setShowBuckets] = useState<boolean>(true);
  return (
    <ShowBucketsContext.Provider value={{ showBuckets, setShowBuckets }}>
      <div>
        <div className="flex">
          <div className="w-[70%]">
            <SearchBar />
            <Statistics />
            <Chart />
            <InvestmentDistribution />
            <StreamingInvestment />
            <HistoryTables />
          </div>
          <div className="w-[30%] ">
            <div className=" flex items-center justify-end gap-5 mt-4 mx-9 p-3 ">
              <div className=" relative cursor-pointer  ">
                <div className=" ">
                  <Image
                    src={BellIcon}
                    alt="Dashboard Icon"
                    width={24}
                    height={24}
                  />
                </div>
                <div className="absolute top-0 -right-5 bg-red-500 rounded-xl w-8 text-center ">
                  <h6 className="__text-cario text-xs">12</h6>
                </div>
              </div>
              <div className="ml-5">
                <Image
                  src={AvatarIcon}
                  alt="Dashboard Icon"
                  width={40}
                  height={40}
                  className=""
                />
              </div>
              <div className="__text-cario font-bold">
                <p>6wxt1F........AFfx</p>
                <p className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold ">
                  $2,258.56
                </p>
              </div>
              <div className="">
                <Image
                  src={DownArrow}
                  alt="Dashboard Icon"
                  width={12}
                  height={12}
                  className=""
                />
              </div>
            </div>
            <Holdings />
          </div>
        </div>
      </div>
    </ShowBucketsContext.Provider>
  );
};

export default TokensDashboard;
