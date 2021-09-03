import Image from "next/image";
import React from "react";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import SolSicon from "../../../assets/icons/Sol-S-icon.svg";
import { getHoldings } from "../../../helpers/get";
import { useShowBucketsContext } from "../../../hooks/ShowBucketsContext";

const Statistics = () => {
  const { showBuckets, setShowBuckets } = useShowBucketsContext();
  const { isLoading, error, data, isFetching } = getHoldings();

  let sumOfPrices;
  let last24hrs;
  let addTotalChanges;
  let weeklyChange;
  const givenNumber = 123423134231233423;

  let NumberFormat = new Intl.NumberFormat("en-US");
  // console.log(NumberFormat.format(givenNumber));
  if (!isLoading && !error && data && data.data) {
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
    // console.log(totalChanges)
    if (totalChanges) {
      addTotalChanges =
        totalChanges?.length > 0
          ? totalChanges.reduce(function (accumulator: any, current: any) {
              return accumulator + current;
            })
          : 0;
    }
    // console.log(addTotalChanges * (sumOfPrices / 100));
    last24hrs = addTotalChanges * (sumOfPrices / 100);
    weeklyChange = data.weekly[0].weekChange * (sumOfPrices / 100);
  }

  return (
    <div className="__dashboard_statistics-bg   border border-[#333335] ml-6 mt-4 pr-4">
      <div className="grid grid-cols-3">
        <div className="flex flex-col p-4">
          <div className="bg-gradient-to-b from-[#61FF8D] to-[#1CE7DA] w-10 h-10 flex place-content-center rounded-xl">
            <Image src={SolSicon} alt="Dashboard Icon" width={20} height={20} />
          </div>
          <div className="__text-cario py-7">
            <h3 className="text-3xl font-bold ">
              $
              {!isLoading &&
                sumOfPrices &&
                NumberFormat.format(sumOfPrices.toFixed(2))}
            </h3>
            <h6 className="text-sm font-thin">Portfolio Total</h6>
          </div>
          {showBuckets ? null : (
            <button className="__text-cario bg-gradient-to-b from-[#EECB4E] to-[#FC3205] w-[9rem] h-10 rounded-lg">
              View Breakdown
            </button>
          )}
        </div>
        <div className="flex flex-col p-4">
          <h3 className="__text-cario font-semibold text-xl">Statistics</h3>
          <div className=" __dashboard_statistics-card-bg rounded-xl  __text-cario border border-[#4A4A4C]  mt-2 p-3 px-7 space-y-3">
            <h5 className="text-lg font-bold">Last 24 hours</h5>
            <div className="flex items-baseline gap-2">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
                $
                {!isLoading &&
                  last24hrs &&
                  NumberFormat.format(last24hrs.toFixed(2) as any)}
              </h2>
              <Image
                src={GreenIcon}
                alt="Dashboard Icon"
                width={22}
                height={20}
              />
              <h5 className="text-xl font-semibold">
                +{addTotalChanges && addTotalChanges.toFixed(2)}%
              </h5>
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
                ${" "}
                {!isLoading &&
                  data &&
                  data.data &&
                  data.data.length > 0 &&
                  data.weekly[0].weekChange &&
                  weeklyChange &&
                  NumberFormat.format(weeklyChange.toFixed(2) as any)}
              </h2>
              <Image
                src={GreenIcon}
                alt="Dashboard Icon"
                width={22}
                height={20}
              />
              <h5 className="text-xl font-semibold">
                +{" "}
                {!isLoading &&
                  data &&
                  data.length > 0 &&
                  data.weekly[0].weekChange.toFixed(2)}
                %
              </h5>
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
