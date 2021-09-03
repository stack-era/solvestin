import React from "react";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import SolidDownArrow from "../../../assets/icons/Solid-Down-Arrow-icon.svg";
import BitcoinIcon from "../../../assets/icons/Bitcoin-icon.svg";
import { getUsersHistoricalPortfolio } from "../../../helpers/get";
import moment from "moment";

const Chart = () => {
  const {
    isLoading,
    error,
    data: portfilio,
    isFetching,
  } = getUsersHistoricalPortfolio();
  // console.log("portfolio", portfilio);
  let performance;
  let lables1String;
  let lables1;
  if (!isLoading && portfilio && portfilio.data) {
    lables1String = Object.keys(portfilio.data);
    performance = Object.values(portfilio.data);
  }

  if (lables1String) {
    lables1 = lables1String.map((value) => moment(value).format("dd-mm hh:mm"));
  }
  // console.log("labels", portfilio.data);

  const data = {
    labels: lables1,
    datasets: [
      {
        label: "$ Value",
        data: performance,
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
          color: "#52525263",
        },
        // min: 5,
        // max: 50,
        // ticks: {
        //   // forces step size to be 50 units
        //   stepSize: 10,
        //   color: "#999999",
        // },
      },
    },

    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="__dashboard_chart-bg flex  ml-6 mt-4 p-5  border border-[#333335] bg-gradient-to-r from-[#1a1a1d] to-[#151518] bg-opacity-5 rounded-2xl ">
      <div className=" w-[65%]   ">
        <div className="flex items-center justify-between ">
          <h3 className="__text-cario text-sm font-semibold text-white mb-4">
            Returns
          </h3>
          <div className=" flex mb-4">
            <h3 className="__text-cario text-sm font-semibold text-white ">
              1 Years
            </h3>
            <div className="flex items-center mx-2 bg-[#242427] p-1 px-3 rounded-xl  ">
              <Image
                src={SolidDownArrow}
                alt="Dashboard Icon"
                width={12}
                height={12}
              />
            </div>
          </div>
        </div>
        <Line data={data} options={options} height={90} />
      </div>
      <div className="ml-6 mt-4 p-3 w-[30%] border border-[#333335] bg-gradient-to-br from-[#41444771] to-[#151515] bg-opacity-5 rounded-2xl">
        <p className="__text-cario text-xs">This Month</p>
        <div className="flex items-center gap-4 my-5">
          <h6 className=" __text-cario px-5 py-3 text-3xl font-bold  bg-[#524EEE] rounded-xl">
            $
          </h6>
          <div className="__text-cario">
            <h3 className="text-[#36DDAB] font-bold">+1.25%</h3>
            <h5 className="text-xs opacity-40">percentage change</h5>
          </div>
        </div>
        <div className="flex items-center gap-4 my-5">
          <div className=" __text-cario px-5 py-3 text-3xl font-bold  bg-[#FD6A3C] rounded-xl">
            <Image
              src={BitcoinIcon}
              alt="Dashboard Icon"
              width={22}
              height={22}
            />
          </div>
          <div className="__text-cario">
            <h3 className="text-[#36DDAB] font-bold">+0.15%</h3>
            <h5 className="text-xs opacity-40">vs BTC</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Chart);
