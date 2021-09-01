import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { getStreams } from "../../../helpers/get";

const StreamingInvestment = () => {
  const router = useRouter();
  const { token } = router.query;

  const { isLoading, error, data: currentStreams, isFetching } = getStreams();
  const [solveToken, setSolveToken] = useState<number | undefined>(
    parseInt(token as string)
  );
  const [intervel, setIntervel] = useState<string | undefined>("");
  const [quantity, setQuantity] = useState<number | undefined>(0);
  const [publicAddress, setPublicAddress] = useState(
    String(localStorage.getItem("publicKey")?.replaceAll('"', ""))
  );

  // console.log(publicAddress);

  const handleStartInvestment = (e: any) => {
    e.preventDefault();
    if (solveToken && intervel && quantity && publicAddress) {
      axios
        .post("http://194.163.160.51:7000/api/save_stream", {
          publicAddress: publicAddress,
          solvesToken: solveToken,
          interval: intervel,
          quantity: quantity,
        })
        .then((response) => {
          console.log(
            "strem started",
            response.data.message,
            response.data.success
          );
        });
    } else {
      console.log("Add all req fileds");
    }
    console.log(publicAddress, solveToken, intervel, quantity);
  };

  return (
    <div className="__text-cario">
      <h2 className="__text-cario font-bold text-2xl mt-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
        Start a Streaming Investment
      </h2>
      <h6 className="text-sm __text-cario text-center mt-4">
        The investment distribution of the token based on percentage
      </h6>
      <h6 className="text-sm __text-cario text-center mt-4">
        Stream payments to <span className="font-bold"> Solbucks 1 </span> to
        automate your investments
      </h6>
      <div className="flex justify-center mt-4">
        <input
          type="number"
          min="0"
          className="text-sm __text-cario text-center bg-[#141417] w-[30%] outline-none ring-1 ring-gray-100 p-2 rounded-md "
          placeholder="Enter investment amount in SOLANA"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>
      <h6 className="text-sm __text-cario text-center mt-4">
        Invest in Solbucks every:
      </h6>
      <div className="flex justify-center mt-3 gap-3 text-sm">
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold "
          onClick={() => setIntervel("1 Day")}
        >
          1 Day
        </button>
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#2ED872]  to-[#2DB1DB] rounded ring-1 ring-gray-200 font-bold"
          onClick={() => setIntervel(" 1 week")}
        >
          1 week
        </button>
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold"
          onClick={() => setIntervel("1 Month")}
        >
          1 Month
        </button>
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold"
          onClick={() => setIntervel("3 Months")}
        >
          3 Months
        </button>
      </div>
      <div className="flex justify-center mt-10">
        <button
          className="w-[30%] p-3 bg-gradient-to-b from-[#8B4EEE]  to-[#B869CC] rounded text-xl font-bold "
          onClick={(e) => handleStartInvestment(e)}
        >
          {" "}
          START INVESMENT{" "}
        </button>
      </div>
      <h6 className="text-sm __text-cario text-center mt-4">
        Please note you will need to maintain SOL <br /> in your account for
        streaming payments to work.
      </h6>

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
            {!isLoading &&
              currentStreams &&
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
                      <button className="py-1 px-4  bg-gradient-to-b from-[#FF374E]  to-[#DA8D96] rounded font-bold text-gray-800">
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
            {/* <tr className="bg-[#232323] font-bold text-sm ">
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

export default StreamingInvestment;
