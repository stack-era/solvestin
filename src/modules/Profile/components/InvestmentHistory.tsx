import React from "react";
import { getUsersSolvestTransactions } from "../../../helpers/get";

const InvestmentHistory = () => {
  const {
    isLoading: isUserTransLoading,
    error: UserTransError,
    data: UserTrans,
    isFetching: isUserTransFeatching,
  } = getUsersSolvestTransactions();
  return (
    <div>
      <h2 className="__text-cario font-bold text-2xl mt-14 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
        Investment History
      </h2>
      <table className=" w-full table-auto __text-cario mb-6 mt-6">
        <thead>
          <tr className="text-[#B869CC] bg-[#26262d33]  ">
            <th className=" p-3 text-left w-1/6 ">Transaction ID</th>
            <th className="w-1/6">Age</th>
            <th className="w-1/6">Source</th>
            <th className="w-1/6">Destination</th>
            <th className="w-1/6">Amount</th>
            <th className="w-1/6">Result</th>
          </tr>
        </thead>
        <tbody>
          {!isUserTransLoading &&
            UserTrans &&
            UserTrans.length > 0 &&
            UserTrans.map((trans: any, index: any) => (
              <tr key={index} className="bg-[#232323] font-bold text-sm ">
                <td className="p-3 max-w-[3rem] truncate">
                  {trans.transactionId}
                </td>
                <td className="text-center">2 minutes ago</td>
                <td className="text-center max-w-[3rem] truncate">
                  {trans.source}
                </td>
                <td className="text-center max-w-[3rem] truncate">
                  {" "}
                  {trans.destination}
                </td>
                <td className="text-center">
                  {" "}
                  {trans.quantity.toFixed(2)} {trans.symbol}
                </td>
                <td className="text-center">
                  <button className=" px-2  bg-[#36DDAB] rounded font-bold text-gray-800">
                    Success
                  </button>
                </td>
              </tr>
            ))}

          {/* <tr className="bg-[#26262d33] font-bold text-sm ">
              <td className="p-3 ">E2kMUXp1ggbDqJtuJ7pssmQ3…</td>
              <td className="text-center">2 minutes ago</td>
              <td className="text-center">3FNZvUQQ6VGc33bt…</td>
              <td className="text-center"> 3j98nUNpX6kA6jSj…</td>
              <td className="text-center"> 100 SOLBUCKS</td>
              <td className="text-center">
                <button className=" px-2  bg-[#36DDAB] rounded font-bold text-gray-800">
                  Success
                </button>
              </td>
            </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default InvestmentHistory;
