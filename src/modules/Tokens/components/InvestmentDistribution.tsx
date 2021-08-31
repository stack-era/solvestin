import React from "react";

const InvestmentDistribution = () => {
  return (
    <div>
      <h2 className="__text-cario font-bold text-2xl mt-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
        Investment Distribution
      </h2>
      <h6 className="text-sm __text-cario text-center">
        The investment distribution of the token based on percentage{" "}
      </h6>
      <div className="flex flex-col items-center mt-14">
        <table className=" w-[50%] table-auto __text-cario mb-6">
          <thead>
            <tr className="text-[#B869CC] bg-[#26262d33]  ">
              <th className="w-[33%] p-3 text-left ">Coin</th>
              <th className="w-[33%]">Price</th>
              <th className="w-[33%]">Distribution</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-[#232323] font-bold ">
              <td className="p-3">Solana (SOL)</td>
              <td className="text-[#FF374E] text-center">$72.15</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#26262d33] font-bold ">
              <td className="p-3">Chainlink (LINK)</td>
              <td className="text-[#36DDAB] text-center">$12.24</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#232323] font-bold ">
              <td className="p-3">Cardano (ADA)</td>
              <td className="text-[#36DDAB] text-center">$12.15</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#26262d33] font-bold ">
              <td className="p-3">Serum (SRM)</td>
              <td className="text-[#36DDAB] text-center">$12.24</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#232323] font-bold ">
              <td className="p-3">Raydium (RAY)</td>
              <td className="text-[#FF374E] text-center">$72.15</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#26262d33] font-bold ">
              <td className="p-3">Bonfida (FIDA)</td>
              <td className="text-[#FF374E] text-center">$72.15</td>
              <td className="text-center"> 42.25%</td>
            </tr>
            <tr className="bg-[#232323] font-bold ">
              <td className="p-3">Oxygen Protocol (OXY)</td>
              <td className="text-[#FF374E] text-center">$72.15</td>
              <td className="text-center"> 42.25%</td>
            </tr>
          </tbody>
        </table>
        <div className="flex gap-4 mb-10">
          <button className="rounded-lg text-black font-bold __text-cario text-xl capitalize bg-gradient-to-b from-[#36DDAB]  to-[#79E18A] p-2 w-[18rem] ">
            BUY SOLBUCKS 1
          </button>
          <button className="rounded-lg text-black font-bold __text-cario text-xl capitalize bg-gradient-to-b from-[#DD5E36]  to-[#E17979] p-2 w-[18rem] ">
            SEll SOLBUCKS 1
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDistribution;
