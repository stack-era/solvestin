import React from "react";
import Image from "next/image";
import SolanaIcon from "../../../assets/icons/Solana-holdings-icon.svg";
import SerumIcon from "../../../assets/icons/Serum-holdings-icon.svg";
import RediyumIcon from "../../../assets/icons/Rediyum-holdings-icon.svg";
import SolanaSIcon from "../../../assets/icons/Sol-S-icon.svg";
import { useShowBucketsContext } from "../../../hooks/ShowBucketsContext";

const Holdings = () => {
  const { showBuckets, setShowBuckets } = useShowBucketsContext();
  return (
    <div className="bg-[#1f1f22] h-screen ml-11 rounded-tl-3xl">
      <div className="__text-cario flex items-center gap-5 p-6">
        <h2 className="font-bold text-xl">Your Holdings</h2>
        <h5 className="text-center w-8 h-5 text-sm font-bold rounded-2xl bg-[#51B56D]">
          {" "}
          3{" "}
        </h5>
      </div>
      <div className="grid grid-flow-row gap-8">
        <div className="flex items-center justify-between px-7">
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
              <h6 className="text-gray-300 text-lg font-semibold ">2.750152</h6>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <h2 className="text-lg">$189.00</h2>
            <h4 className="text-green-600">+ $21.41 (1.25%)</h4>
          </div>
        </div>
        <div className="flex items-center justify-between px-7">
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
              <h6 className="text-gray-300 text-lg font-semibold ">15.1241</h6>
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
        </div>
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
        <div className="__text-cario relative  rounded-xl border border-[#394445] mx-7 mt-72 ">
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
              onClick={() => setShowBuckets(true)}
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
  );
};

export default Holdings;
