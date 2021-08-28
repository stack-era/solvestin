import React from 'react'

const YourPayments = () => {
    return (
      <div>
        <h2 className="__text-cario font-bold text-2xl mt-14 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
          Current Streaming Payments
        </h2>

        <div className="">
          <table className=" w-full table-auto __text-cario mb-6 mt-6">
            <thead>
              <tr className="text-[#B869CC] bg-[#26262d33]  ">
                <th className=" p-3 text-left w-1/6 ">Token</th>
                <th className="w-1/6">Age</th>
                <th className="w-1/6">Stream Duration</th>
                <th className="w-1/6">Amount</th>
                <th className="w-1/6">USD Value</th>
                <th className="w-1/6">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#232323] font-bold text-sm ">
                <td className="p-3 text-[#36DDAB]">SOLBUCKS 1</td>
                <td className="text-center">2 minutes ago</td>
                <td className="text-center"> 1 Week</td>
                <td className="text-center"> 10 SOLANA</td>
                <td className="text-center"> $780.15</td>
                <td className="text-center">
                  <button className="py-1 px-4  bg-gradient-to-b from-[#FF374E]  to-[#DA8D96] rounded font-bold text-gray-800">
                    Cancel Stream
                  </button>
                </td>
              </tr>
              <tr className="bg-[#26262d33] font-bold text-sm ">
                <td className="p-3 text-[#36DDAB]">SOLBUCKS 1</td>
                <td className="text-center">2 minutes ago</td>
                <td className="text-center"> 1 Week</td>
                <td className="text-center"> 10 SOLANA</td>
                <td className="text-center"> $780.15</td>
                <td className="text-center">
                  <button className="py-1 px-4  bg-gradient-to-b from-[#FF374E]  to-[#DA8D96] rounded font-bold text-gray-800">
                    Cancel Stream
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
}

export default YourPayments
