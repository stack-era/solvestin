import React from "react";
import Image from "next/image";
import SearchIcon from "../../assets/icons/Search-icon.svg";
import BellIcon from "../../assets/icons/Bell-icon.svg";
import AvatarIcon from "../../assets/icons/Avatar-icon.svg";
import DownArrow from "../../assets/icons/Down-Arrow-icon.svg";
import Statistics from "./components/Statistics";
import Holdings from "./components/Holdings";
import Chart from "./components/Chart";
import Allinvestments from "./components/Allinvestments";
import InvestmentBuckets from "./components/InvestmentBuckets";
import { ShowBucketsContext } from "../../hooks/ShowBucketsContext";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const [showBuckets, setShowBuckets] = useState<boolean>(false);
  return (
    <ShowBucketsContext.Provider value={{ showBuckets, setShowBuckets }}>
      <div>
        <div className="flex">
          <div className="w-[70%]">
            <div className="flex items-center">
              <div className="flex flex-col ml-6 mt-7">
                <h2 className="__text-cario font-bold text-xl">
                  Get started with Investing
                </h2>
                <h6 className="__text-cario text-xs font-thin">
                  Now invest in Investment Buckets with Solana
                </h6>
              </div>
              <div className="__dashboard-input-bg flex items-center gap-2 ml-28   h-12 mt-7 p-3 opacity-70 border border-[#333335]">
                <Image
                  src={SearchIcon}
                  alt="Dashboard Icon"
                  width={20}
                  height={20}
                />
                <input
                  type="text"
                  placeholder="Search anything here..."
                  className=" h-9 w-[20rem] bg-transparent outline-none"
                />
              </div>
            </div>
            <Statistics />
            {showBuckets ? (
              <InvestmentBuckets />
            ) : (
              <>
                <Chart />
                <Allinvestments />
              </>
            )}
            {/* <Chart />
          <Allinvestments /> */}
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

export default Dashboard;
