import React from "react";


const Allinvestments = () => {

 
  return (
    <div className="__text-cario flex mt-6 ml-6 ">
      <div className="w-[30%] ">
        <div className="flex items-center gap-2">
          <h3 className="">All Investments </h3>
          <h5 className="text-center w-8 h-5 text-sm font-bold rounded-2xl bg-[#51B56D]">
            2
          </h5>
        </div>
        <div className="grid grid-cols-2 mt-3 space-x-2">
          <div className="__dashboard_allInvestments-token-bg p-4 w-[170px] h-[200px] border border-[#404042]">
            <h4 className="">SolVest Token Ecosystem</h4>
            <h1 className="text-3xl font-bold mt-9">$767.50</h1>
            <h6 className="text-sm text-[#36DDAB] mt-1">+$150.50</h6>
            <h6 className="text-xs opacity-60 mt-3">Since Last Month</h6>
          </div>
          <div className="__dashboard_allInvestments-token-bg p-4 w-[170px] h-[200px] border border-[#404042]">
            <h4 className="">Other Investments</h4>
            <h1 className="text-3xl font-bold mt-9">- $328.85</h1>
            <h6 className="text-sm text-[#FF374E] mt-1">-$150.50</h6>
            <h6 className="text-xs opacity-60 mt-3">Since Last Month</h6>
          </div>
        </div>
      </div>

      <div className=" w-[50%] ml-14 ">
        <div className="flex items-center gap-2">
          <h3 className="">All Transactions </h3>
          <h5 className="text-center w-8 h-5 text-sm font-bold rounded-2xl bg-[#51B56D]">
            12
          </h5>
        </div>
        <div className=" mt-3 ">
          <div className="__dashboard_allInvestments-token-bg p-4 h-[230px] border border-[#404042]">
            <h4 className="">Recent Transactions</h4>
            <div className="__dashboard_allInvestments-transactions-bg flex items-center justify-between mt-4 p-3 ">
              <div className="flex  gap-3 ">
                <h4 className="w-10 h-10 text-center rounded-full bg-gradient-to-b from-[#36DDAB] to-[#E9FFAA] text-gray-800 text-3xl">
                  +
                </h4>
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">SOLANA (SOL) </h2>
                  <h6 className="opacity-60 text-xs">BUY 2.151617 SOL</h6>
                </div>
              </div>
              <h6 className="text-xl text-[#36DDAB] mt-1">+ $49.59</h6>
            </div>
            <div className=" flex items-center justify-between mt-2 p-3">
              <div className="flex  gap-3 ">
                <h4 className="w-10 h-10 text-center rounded-full bg-gradient-to-b to-[#FC354C] from-[#FF9983]  text-3xl">
                  -
                </h4>
                <div className="flex flex-col">
                  <h2 className="font-bold text-lg">SOLVEST TOKEN (SOLV)</h2>
                  <h6 className="opacity-60 text-xs">SELL 1.15 SOLV</h6>
                </div>
              </div>
              <h6 className="text-xl text-[#FF374E] mt-1">- $49.59</h6>
            </div>
            <h3 className="text-sm opacity-50 text-center underline cursor-pointer">
              See all transactions
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allinvestments;
