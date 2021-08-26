import React from "react";
import Image from "next/image";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";

const Statistics = () => {
  return (
    <div className="flex items-center gap-10 ml-6 mt-7">
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
            $120.15
          </h2>
          <Image src={GreenIcon} alt="Dashboard Icon" width={22} height={20} />
          <h5 className="text-xl font-semibold">+ 6.7%</h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Portfolio Total
        </h3>
      </div>
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
            $120.15
          </h2>
          <Image src={GreenIcon} alt="Dashboard Icon" width={22} height={20} />
          <h5 className="text-xl font-semibold">+ 6.7%</h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Portfolio Total
        </h3>
      </div>
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
            $120.15
          </h2>
          <Image src={GreenIcon} alt="Dashboard Icon" width={22} height={20} />
          <h5 className="text-xl font-semibold">+ 6.7%</h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Portfolio Total
        </h3>
      </div>
    </div>
  );
};

export default Statistics;
