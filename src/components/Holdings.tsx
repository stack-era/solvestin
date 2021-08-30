import React from "react";
import Image from "next/image";
import SolanaIcon from "../assets/icons/Solana-holdings-icon.svg";
import SerumIcon from "../assets/icons/Serum-holdings-icon.svg";
import RediyumIcon from "../assets/icons/Rediyum-holdings-icon.svg";
import SolanaSIcon from "../assets/icons/Sol-S-icon.svg";
import BellIcon from "../assets/icons/Bell-icon.svg";
import AvatarIcon from "../assets/icons/Avatar-icon.svg";
import DownArrow from "../assets/icons/Down-Arrow-icon.svg";
import { useShowBucketsContext } from "../hooks/ShowBucketsContext";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getHoldings } from "../helpers/get";

interface HoldingsProps {}

const Holdings: React.FC<HoldingsProps> = () => {
  const router = useRouter();
  const { showBuckets, setShowBuckets } = useShowBucketsContext();

  const { isLoading, error, data, isFetching } = getHoldings();

  return (
    <>
      <div className=" flex items-center justify-end gap-5 mt-4 mx-9 p-3 ">
        <div className=" relative cursor-pointer  ">
          <div className=" ">
            <Image src={BellIcon} alt="Dashboard Icon" width={24} height={24} />
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
      <div className="bg-[#1f1f22] h-screen   ml-11 rounded-tl-3xl">
        <div className="__text-cario flex items-center gap-5 p-6">
          <h2 className="font-bold text-xl">Your Holdings</h2>
          <h5 className="text-center w-8 h-5 text-sm font-bold rounded-2xl bg-[#51B56D]">
            {data?.length}
          </h5>
        </div>
        <div className="__hide-scrollbar grid grid-flow-row gap-8 overflow-y-scroll h-[50%] ">
          {!isLoading &&
            data.map((token: any, index: any) => (
              <div
                className="flex items-center justify-between px-7"
                key={index}
              >
                <div className="flex items-center gap-5">
                  <div className=" bg-black rounded-full flex place-content-center w-14 h-10">
                    {token.tokenIcon !== "" ? (
                      <Image
                        src={token.tokenIcon}
                        alt="Dashboard Icon"
                        width={60}
                        height={20}
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col __text-cario w-full">
                    <h2 className="font-bold text-lg">
                      {token.tokenName} ({token.tokenSymbol})
                    </h2>
                    <h6 className="text-gray-300 text-lg font-semibold ">
                      {token.tokenAmountUI}
                    </h6>
                  </div>
                </div>
                <div className="flex flex-col items-end w-[37%]">
                  <h2 className="text-lg">${token.priceUsdt}</h2>
                  {token.todayChange.toFixed(4) > 0 ? (
                    <h4 className="text-green-600">
                      + ${token.todayChange.toFixed(4)}
                    </h4>
                  ) : (
                    <h4 className="text-red-600">
                      - ${token.todayChange.toFixed(4)}
                    </h4>
                  )}
                </div>
              </div>
            ))}
          {/* <div className="flex items-center justify-between px-7">
            <div className="flex items-center gap-5">
              <div className=" bg-black rounded-full flex place-content-center w-12 h-12">
                <Image
                  src={SolanaIcon}
                  alt="Dashboard Icon"
                  width={25}
                  height={25}
                  className=""
                />
              </div>
              <div className="flex flex-col __text-cario">
                <h2 className="font-bold text-lg">Solana (SOL)</h2>
                <h6 className="text-gray-300 text-lg font-semibold ">
                  2.750152
                </h6>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-lg">$189.00</h2>
              <h4 className="text-green-600">+ $21.41 (1.25%)</h4>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-between px-7">
            <div className="flex items-center gap-5">
              <div className=" bg-black rounded-full flex place-content-center w-12 h-12">
                <Image
                  src={SerumIcon}
                  alt="Dashboard Icon"
                  width={25}
                  height={25}
                  className=""
                />
              </div>
              <div className="flex flex-col __text-cario">
                <h2 className="font-bold text-lg">Serum (SRM)</h2>
                <h6 className="text-gray-300 text-lg font-semibold ">
                  15.1241
                </h6>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-lg">$15,289.00</h2>
              <h4 className="text-red-600">- $1,21.41 (1.25%)</h4>
            </div>
          </div>
          <div className="flex items-center justify-between px-7">
            <div className="flex items-center gap-5">
              <div className=" bg-black rounded-full flex place-content-center w-12 h-12">
                <Image
                  src={RediyumIcon}
                  alt="Dashboard Icon"
                  width={25}
                  height={25}
                  className=""
                />
              </div>
              <div className="flex flex-col __text-cario">
                <h2 className="font-bold text-lg">Radiyum (RAY)</h2>
                <h6 className="text-gray-300 text-lg font-semibold ">
                  7,1231.14
                </h6>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-xl">$11,289.00</h2>
              <h4 className="text-red-600">- $511.41 (12.25%)</h4>
            </div>
          </div> */}
        </div>
        {showBuckets ? (
          <div className="">
            <div className="absolute  bottom-8 right-8 opacity-40 ">
              <Image
                src={SolanaSIcon}
                alt="Dashboard Icon"
                width={115}
                height={115}
                className=""
              />
            </div>
          </div>
        ) : (
          <div className="__text-cario relative  rounded-xl border border-[#394445] mx-7 mt-7 ">
            <div className="p-5 ">
              <h2 className="font-bold text-2xl">Streaming Investments</h2>
              <p className="font-semibold text-gray-500">
                Get started with streaming investments on SolVest.
              </p>
              <p className="font-semibold text-gray-500 mt-5 ">
                Create Daily, Weekly, Monthly Streams to invest in <br />{" "}
                auto-mode with SolVest Investment Buckets.
              </p>

              <button
                className="rounded-xl px-3 mt-9 w-48 h-14 bg-gradient-to-b from-[#00FFF0] to-[#0066FE] font-semibold text-lg "
                onClick={() => {
                  setShowBuckets(true);
                  router.push("/buckets");
                }}
              >
                INVEST NOW
              </button>
            </div>
            <div className="absolute  bottom-0 right-2 opacity-40 ">
              <Image
                src={SolanaSIcon}
                alt="Dashboard Icon"
                width={115}
                height={115}
                className=""
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Holdings;
