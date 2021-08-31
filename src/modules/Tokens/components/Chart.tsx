import React from "react";
import { Line } from "react-chartjs-2";
import Image from "next/image";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import { useActiveWindowContext } from "../../../hooks/ActiveWindowContext";
import { getOneSolvestTokens } from "../../../helpers/get";
import { useRouter } from "next/router";

const Chartdata = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [40, 40, 30, 10, 10, 10, 10, 48, 40, 30, 20, 20],
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
      min: 5,
      max: 50,
      ticks: {
        // forces step size to be 50 units
        stepSize: 10,
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

const Chart = () => {
  const router = useRouter();
  const { token } = router.query;


  const { isLoading, error, data, isFetching } = getOneSolvestTokens(
    parseInt(token as string)
  );
  // console.log(data);

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
        <button className="w-[103px] h-[62px] bg-gradient-to-b from-[#5C8FFF] to-[#7B78FF] rounded-md ml-[20%]  font-bold text-gray-800 __text-cario">
          ADD TO WALLET
        </button>
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
