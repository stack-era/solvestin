import React from "react";
import Image from "next/image";
import SearchIcon from "../../assets/icons/Search-icon.svg";
import Statistics from "./components/Statistics";

const Dashboard: React.FC = () => {
  return (
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
            <div className="__dashboard-input-bg flex items-center gap-2 ml-28   h-14 mt-7 p-3 opacity-70 border border-[#333335]">
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
        </div>
        <div className="w-[30%]"></div>
      </div>
    </div>
  );
};

export default Dashboard;
