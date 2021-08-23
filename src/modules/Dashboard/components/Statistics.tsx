import React from "react";
import Image from "next/image";
import SolSicon from "../../../assets/icons/Sol-S-icon.svg";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";

const Statistics = () => {
  return (
    <div className="__dashboard_statistics-bg   border border-[#333335] ml-6 mt-4 pr-4">
      <div className="grid grid-cols-3">
        <div className="flex flex-col p-4">
          <div className="bg-gradient-to-b from-[#61FF8D] to-[#1CE7DA] w-10 h-10 flex place-content-center rounded-xl">
            <Image src={SolSicon} alt="Dashboard Icon" width={20} height={20} />
          </div>
          <div className="__text-cario py-7">
            <h3 className="text-2xl font-bold ">$8.779,58</h3>
            <h6 className="text-sm font-thin">Portfolio Total</h6>
          </div>
          <button className="__text-cario bg-gradient-to-b from-[#EECB4E] to-[#FC3205] w-[9rem] h-10 rounded-lg">
            View Breakdown
          </button>
        </div>
        <div className="flex flex-col p-4">
          <h3 className="__text-cario font-semibold text-xl">Statistics</h3>
          <div className=" __dashboard_statistics-card-bg rounded-xl  __text-cario border border-[#4A4A4C]  mt-2 p-3 px-7 space-y-3">
            <h5 className="text-lg font-bold">Last 24 hours</h5>
            <div className="flex items-baseline gap-2">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
                $120.15
              </h2>
              <Image
                src={GreenIcon}
                alt="Dashboard Icon"
                width={22}
                height={20}
              />
              <h5 className="text-xl font-semibold">+ 6.7%</h5>
            </div>
            <div className="relative pt-3">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#39393b]">
                <div
                  style={{ width: "40%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#FC354C] to-[#FFBC7D] "
                ></div>
              </div>
            </div>
            <h3 className="text-gray-400 __text-cario text-sm font-medium">
              Your Goal ($250.00)
            </h3>
          </div>
        </div>
        <div className="flex flex-col p-4 pt-11">
          <div className="__dashboard_statistics-card-bg rounded-xl  __text-cario border border-[#4A4A4C]  mt-2 p-3 px-7 space-y-3">
            <h5 className="text-lg font-bold">Last 7 days</h5>
            <div className="flex items-baseline gap-2">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
                $2,220.15
              </h2>
              <Image
                src={GreenIcon}
                alt="Dashboard Icon"
                width={22}
                height={20}
              />
              <h5 className="text-xl font-semibold">+ 6.7%</h5>
            </div>
            <div className="relative pt-3">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[#39393b]">
                <div
                  style={{ width: "70%" }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#0075FF] to-[#1DC8FE] "
                ></div>
              </div>
            </div>
            <h3 className="text-gray-400 __text-cario text-sm font-medium">
              Your Goal ($3000.00)
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;