import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useInvestProgram } from "../../../context/Invest";
import { useCustomWallet } from "../../../context/Wallet";
import { calcStreamDuration } from "../../../helpers/calcStreamDuration";
import { displayKey } from "../../../helpers/displayKey";
import { Time } from "../../../helpers/Time";
import { INTERVAL, intervalString } from "../../../solana/invest";
import { lamportsToSol } from "../../../solana/utils/lamportsToSol";

dayjs.extend(relativeTime);

const StreamingInvestment = () => {
  const [interval, setInterval] = useState<INTERVAL>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const { connected, balance, walletPK } = useCustomWallet();
  const { invests, createInvest, refetchAll } = useInvestProgram();

  console.log(invests.map(({ publicKey }) => publicKey.toString()));
  const onSubmit = async (
    totalAmount: number,
    intervalCount: number,
    interval: INTERVAL
  ) => {
    if (!connected || !walletPK) {
      return window.alert("Connect Your Wallet to start Investing!!");
    }

    const startTime = Time.now() + Time.DILATION;
    const endTime = Time.intervalTime(interval, intervalCount) + Time.DILATION;

    if (totalAmount >= balance) {
      toast.error("Insufficient Balance", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (totalAmount <= 0 || intervalCount <= 0) {
      toast.error("Invalid inputs", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,

        progress: undefined,
        theme: "dark",
      });

      return;
    }

    const confirmMsg = `
      Lock my ${totalAmount} SOL in SolVest!
      SolVest will invest ${
        totalAmount / intervalCount
      } SOL per ${intervalString(interval)}
    `;

    if (window.confirm(confirmMsg)) {
      const investPda = await createInvest(
        startTime,
        endTime,
        totalAmount,
        interval
      );

      if (investPda) {
        // successfully invested totalAmount

        toast(`Locked ${totalAmount} at ${displayKey(investPda)}`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        // send this address to api along with startTime, endTime, totalAmount, interval
        axios
          .post("https://solvest.in/api/save_stream", {
            publicAddress: walletPK,
            investPda,
            startTime,
            endTime,
            totalAmount,
            interval,
          })
          .then(async () => {
            // after some time refetch all investments
            setTimeout(refetchAll, 30000);
            toast(`Investing ${totalAmount / intervalCount} SOL ....`, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((e) => {
            toast.error(e.message, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      }
    } else {
      toast(`Investment of ${totalAmount} SOL is cancelled`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
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
          placeholder="Enter total investment amount in SOL"
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <h6 className="text-sm __text-cario text-center mt-4">
        Invest in Solbucks for:
      </h6>
      <div className="flex justify-center mt-4">
        <input
          type="number"
          min="0"
          className="text-sm __text-cario text-center bg-[#141417] w-[20%] outline-none ring-1 ring-gray-100 p-2 rounded-md "
          placeholder="Enter duration"
          onChange={(e) => setDuration(parseInt(e.target.value))}
        />
      </div>
      <div className="flex justify-center mt-3 gap-3 text-sm">
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold relative"
          onClick={() => setInterval(INTERVAL.DAY)}
        >
          Day's
          {interval === INTERVAL.DAY && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute top-[-6px] right-[-6px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold relative"
          onClick={() => setInterval(INTERVAL.WEEK)}
        >
          Week's
          {interval === INTERVAL.WEEK && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute top-[-6px] right-[-6px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        <button
          className="py-3 w-[74px] bg-gradient-to-b from-[#00A3FF] via-[#5C8FFF] to-[#1F5AF0] rounded font-bold relative"
          onClick={() => setInterval(INTERVAL.MONTH)}
        >
          Month's
          {interval === INTERVAL.MONTH && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute top-[-6px] right-[-6px]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="w-max mx-auto">
        <div className="flex justify-start items-start mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>

          <h6 className="text-sm __text-cario mx-2">
            We'll Invest{" "}
            {!!quantity && !!duration
              ? Number(quantity / duration).toFixed(2)
              : 0}{" "}
            SOL per {intervalString(interval)}
          </h6>
        </div>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="w-[30%] p-3 bg-gradient-to-b from-[#8B4EEE]  to-[#B869CC] rounded text-xl font-bold relative"
          onClick={() => onSubmit(quantity, duration, interval)}
        >
          START INVESTMENT
        </button>
      </div>
      <div className="flex justify-center items-start mt-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <h6 className="text-sm __text-cario mx-2">
          Please note after successful investment,
          <br /> it might take 10 to 20 sec to reflect on UI.
        </h6>
      </div>

      <h2 className="__text-cario font-bold text-2xl mt-14 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
        Current Streaming Payments
      </h2>

      <div className="">
        <table className=" w-full table-auto __text-cario mb-6 mt-6">
          <thead>
            <tr className="text-[#B869CC] bg-[#26262d33]  ">
              <th className=" p-3 text-left w-1/6 ">Index</th>
              <th className="w-1/7">Age</th>
              <th className="w-1/7">Stream Duration</th>
              <th className="w-1/7">Amount(total)</th>
              <th className="w-1/7">Invested(till now)</th>
              <th className="w-1/7">Locked</th>
              <th className="w-1/7">Status</th>
            </tr>
          </thead>
          <tbody>
            {invests.map(
              (
                {
                  data: {
                    start_time,
                    end_time,
                    amount,
                    withdrawn = 0,
                    interval,
                  },
                },
                index
              ) => {
                return (
                  <tr
                    key={index}
                    className={`${
                      (index + 1) % 2 === 0 ? "bg-[#26262d33]" : "bg-[#232323]"
                    } font-bold text-sm `}
                  >
                    <td className="p-3 text-[#36DDAB]">{index}</td>
                    <td className="text-center">
                      {dayjs(start_time * 1000).toNow(true)} ago
                    </td>
                    <td className="text-center">
                      {calcStreamDuration(start_time, end_time, interval)}
                    </td>
                    <td className="text-center">
                      {lamportsToSol(amount).toFixed(2)} SOL
                    </td>
                    <td className="text-center">
                      {lamportsToSol(withdrawn).toFixed(2)} SOL
                    </td>
                    <td className="text-center">
                      {lamportsToSol(amount - withdrawn).toFixed(2)} SOL
                    </td>
                    <td className="text-center">
                      {end_time * 1000 > Date.now() ? (
                        <button
                          disabled={true}
                          className="cursor-not-allowed opacity-80 py-1 px-4  bg-gradient-to-b from-[#FF374E]  to-[#DA8D96] rounded font-bold text-gray-800"
                        >
                          Cancel Stream
                        </button>
                      ) : (
                        <button
                          disabled={true}
                          className="cursor-not-allowed opacity-80 py-1 px-4  bg-gradient-to-b from-[#a8e0d0]  to-[#4bad90] rounded font-bold text-gray-800"
                        >
                          Stream Ended
                        </button>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StreamingInvestment;
