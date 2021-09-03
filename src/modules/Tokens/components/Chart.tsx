import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { Line } from "react-chartjs-2";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import { useCustomWallet } from "../../../context/Wallet";
import {
  getOneSolvestTokens,
  getSolvestChartTokensData,
} from "../../../helpers/get";
import moment from "moment";

const Chart = () => {
  const router = useRouter();
  const { token, symbol } = router.query;

  const { isSolBuckAdded, addSolBucksToAccount } = useCustomWallet();

  const { isLoading, error, data, isFetching } = getOneSolvestTokens(
    parseInt(token as string)
  );

  const {
    isLoading: isChartLoading,
    error: chartError,
    data: chartData,
    isFetching: isChartFetching,
  } = getSolvestChartTokensData(symbol as string);
  // console.log(chartData);

  let price;
  let time;

  if (!isChartLoading && chartData) {
    price = chartData.map((value: any) => value.price);
    time = chartData.map((value: any) => {
      const newd = new Date(value.time);
      return moment(newd).format("dd-mm hh:mm");
    });
  }

  const Chartdata = {
    labels: time,
    datasets: [
      {
        label: "# of Votes",
        data: price,
        fill: false,
        backgroundColor: "#524EEE",
        borderColor: "#534eeeb0",
      },
    ],
  };

  const options = {
    scales: {
      x: {
        grid: {
          display: false,
          color: "#52525265",
        },
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        grid: {
          display: true,
          color: "#52525230",
        },
        min: 2,
        max: 50,
        ticks: {
          // forces step size to be 50 units
          stepSize: 1,
          color: "#999999",
        },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="   ml-6 mt-4 p-5   rounded-2xl ">
      <div className="flex">
        <div className="ml-[42%]">
          <h1 className="text-center __text-cario font-bold text-3xl ">
            {!isLoading && data && data[0].name}
          </h1>
          <div className="flex items-baseline justify-center gap-2 my-3 ">
            <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
              $ {!isLoading && data && data[0].price.toFixed(2)}
            </h2>
            <Image
              src={GreenIcon}
              alt="Dashboard Icon"
              width={12}
              height={10}
            />
            <h5 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A]">
              + 6.7%
            </h5>
          </div>
        </div>
        {!isSolBuckAdded && (
          <button
            onClick={addSolBucksToAccount}
            className="w-[103px] h-[62px] bg-gradient-to-b from-[#5C8FFF] to-[#7B78FF] rounded-md ml-[20%]  font-bold text-gray-800 __text-cario"
          >
            ADD TO WALLET
          </button>
        )}
      </div>
      <h6 className="text-center text-xs __text-cario mb-3">
        The investment distribution of the token based on percentage{" "}
      </h6>
      <div className=" w-full ">
        <Line data={Chartdata} options={options} height={70} />
      </div>
    </div>
  );
};

export default React.memo(Chart);
