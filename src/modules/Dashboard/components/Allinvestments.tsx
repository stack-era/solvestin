import React from "react";
import { getUsersSolvestTransactions } from "../../../helpers/get";

const Allinvestments = () => {
  const {
    isLoading: isUserTransLoading,
    error: UserTransError,
    data: UserTrans,
    isFetching: isUserTransFeatching,
  } = getUsersSolvestTransactions();

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
            {!isUserTransLoading && UserTrans && UserTrans.length}
          </h5>
        </div>
        <div className=" mt-3 ">
          <div className="__dashboard_allInvestments-token-bg __hide-scrollbar p-4 h-[230px] border border-[#404042] overflow-y-scroll">
            <h4 className="">Recent Transactions</h4>

            {!isUserTransLoading &&
              UserTrans &&
              UserTrans.length > 0 &&
              UserTrans.map((trans: any, index: any) => (
                <div
                  key={index}
                  className="hover:border border-[#363639] hover:bg-gradient-to-r from-[#41444771] to-[#222222] bg-opacity-5 rounded-lg flex items-center justify-between mt-4 p-3 "
                >
                  <div className="flex  gap-3 ">
                    {trans.side === "BUY" ? (
                      <h4 className="w-10 h-10 text-center rounded-full bg-gradient-to-b from-[#36DDAB] to-[#E9FFAA] text-gray-800 text-3xl">
                        +
                      </h4>
                    ) : (
                      <h4 className="w-10 h-10 text-center rounded-full bg-gradient-to-b to-[#FC354C] from-[#FF9983]  text-3xl">
                        -
                      </h4>
                    )}

                    <div className="flex flex-col">
                      <h2 className="font-bold text-lg">
                        {trans.ame} ({trans.symbol}){" "}
                      </h2>
                      <h6 className="opacity-60 text-xs">
                        {trans.side} {trans.quantity.toFixed(2)} {trans.symbol}
                      </h6>
                    </div>
                  </div>
                  {trans.side === "BUY" ? (
                    <h6 className={`text-xl text-[#36DDAB] mt-1`}>
                      + {(trans.quantity * trans.latestPrice).toFixed(2)}
                    </h6>
                  ) : (
                    <h6 className="text-xl text-[#FF374E] mt-1">
                      - {(trans.quantity * trans.latestPrice).toFixed(2)}
                    </h6>
                  )}
                </div>
              ))}

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
