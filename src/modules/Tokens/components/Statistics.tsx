import React from "react";
import Image from "next/image";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import SolanaSmallIcon from "../../../assets/icons/Solana-small-icon.svg";
import { getHoldings } from "../../../helpers/get";

const Statistics = () => {
  const { isLoading, error, data, isFetching } = getHoldings();

  let sumOfPrices;
  let last24hrs;
  let addTotalChanges;

  if (!isLoading) {
    const totalPrices = data.map(
      (token: any) => token.priceUsdt * token.tokenAmountUI
    );
    // console.log(totalPrices);
    sumOfPrices = totalPrices.reduce(function (accumulator: any, current: any) {
      return accumulator + current;
    });
    // console.log(sumOfPrices.toFixed(2));
    const totalChanges = data.map((token: any) => token.todayChange);
    addTotalChanges = totalChanges.reduce(function (
      accumulator: any,
      current: any
    ) {
      return accumulator + current;
    });
    // console.log(addTotalChanges * (sumOfPrices / 100));
    last24hrs = addTotalChanges * (sumOfPrices / 100);
  }
  return (
    <div className="flex items-center gap-10 ml-6 mt-7">
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 pr-16 space-y-3 ">
        <div className="flex items-center gap-2">
          <div className="flex place-content-center rounded-xl h-10 w-10 bg-gradient-to-b from-[#61FF8D] to-[#1CE7DA]">
            <Image
              src={SolanaSmallIcon}
              alt="Dashboard Icon"
              width={22}
              height={20}
            />
          </div>
          <h2 className="font-bold text-2xl ">
            $ {!isLoading && sumOfPrices && sumOfPrices.toFixed(2)}
          </h2>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Portfolio Total
        </h3>
      </div>
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
            ${!isLoading && last24hrs && last24hrs.toFixed(2)}
          </h2>
          <Image src={GreenIcon} alt="Dashboard Icon" width={22} height={20} />
          <h5 className="text-xl font-semibold">
            +{addTotalChanges && addTotalChanges.toFixed(2)}%
          </h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Last 24 hours
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
          Last 7 days
        </h3>
      </div>
    </div>
  );
};

export default Statistics;