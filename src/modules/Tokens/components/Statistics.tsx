import Image from "next/image";
import React from "react";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import SolanaSmallIcon from "../../../assets/icons/Solana-small-icon.svg";
import { getHoldings } from "../../../helpers/get";

const Statistics = () => {
  const { isLoading, error, data, isFetching } = getHoldings();

  let sumOfPrices;
  let last24hrs;
  let addTotalChanges;
  let weeklyChange;
  let NumberFormat = new Intl.NumberFormat("en-US");

  if (!isLoading && !error && data && data.data && data.data.length > 0) {
    const totalPrices = data.data.map(
      (token: any) => token.priceUsdt * token.tokenAmountUI
    );
    // console.log(totalPrices);
    sumOfPrices =
      totalPrices?.length > 0
        ? totalPrices.reduce(function (accumulator: any, current: any) {
            return accumulator + current;
          })
        : 0;
    // console.log(sumOfPrices.toFixed(2));
    const totalChanges = data.data.map((token: any) => token.todayChange);
    addTotalChanges =
      totalChanges?.length > 0
        ? totalChanges.reduce(function (accumulator: any, current: any) {
            return accumulator + current;
          })
        : 0;
    // console.log(addTotalChanges * (sumOfPrices / 100));
    last24hrs = addTotalChanges * (sumOfPrices / 100);
    weeklyChange = data.weekly[0].weekChange * (sumOfPrices / 100);
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
            ${" "}
            {!isLoading &&
              sumOfPrices &&
              NumberFormat.format(sumOfPrices.toFixed(2))}
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
            +
            {addTotalChanges && NumberFormat.format(addTotalChanges.toFixed(2))}
            %
          </h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Last 24 hours
        </h3>
      </div>
      <div className=" __tokens_statistics-card-bg rounded-xl  __text-cario   mt-2 p-3 px-7 space-y-3">
        <div className="flex items-baseline gap-2">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
            ${" "}
            {!isLoading &&
              data &&
              data.data &&
              data.data.length > 0 &&
              data.weekly[0].weekChange &&
              weeklyChange &&
              weeklyChange.toFixed(2)}
          </h2>
          <Image src={GreenIcon} alt="Dashboard Icon" width={22} height={20} />
          <h5 className="text-xl font-semibold">
            +{" "}
            {!isLoading &&
              data &&
              data.data &&
              data.data.length > 0 &&
              NumberFormat.format(data.weekly[0].weekChange.toFixed(2))}
            %
          </h5>
        </div>

        <h3 className="text-gray-400 __text-cario text-sm font-medium">
          Last 7 days
        </h3>
      </div>
    </div>
  );
};

export default Statistics;
