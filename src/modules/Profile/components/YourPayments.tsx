import axios from "axios";
import React from "react";
import { getStreams, getTokenTransactions } from "../../../helpers/get";

const YourPayments = () => {
  const { isLoading, error, data: trans, isFetching } = getTokenTransactions();
  const {
    isLoading: isStreamLoading,
    error: streamError,
    data: currentStreams,
    isFetching: isStremFeatching,
  } = getStreams();

  const cancleStream = (id: any) => {
    axios
      .get(`https://solvest.in/api/stop_stream?streamId=${id}`)
      .then((response) => console.log(response.data.message));
  };
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
            {!isStreamLoading &&
              currentStreams &&
              currentStreams.length > 0 &&
              currentStreams.map((stream: any, index: any) => (
                <tr
                  key={index}
                  className={`${
                    (index + 1) % 2 === 0 ? "bg-[#26262d33]" : "bg-[#232323]"
                  } font-bold text-sm `}
                >
                  <td className="p-3 text-[#36DDAB]">{stream.name} 1</td>
                  <td className="text-center">2 minutes ago</td>
                  <td className="text-center"> {stream.interval}</td>
                  <td className="text-center"> {stream.quantity} SOLANA</td>
                  <td className="text-center"> ${stream.price.toFixed(4)}</td>
                  <td className="text-center">
                    {stream.active ? (
                      <button
                        className="py-1 px-4  bg-gradient-to-b from-[#FF374E]  to-[#DA8D96] rounded font-bold text-gray-800"
                        onClick={() => cancleStream(stream.id)}
                      >
                        Cancel Stream
                      </button>
                    ) : (
                      <button className="py-1 px-4  bg-gradient-to-b from-[#a8e0d0]  to-[#4bad90] rounded font-bold text-gray-800">
                        Stream Ended
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {/* <tr className="bg-[#26262d33] font-bold text-sm ">
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
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default YourPayments;
