import React, { useState } from "react";
import Image from "next/image";
import LogoIcon from "../../assets/icons/Logo-icon.svg";
import DashboardIcon from "../../assets/icons/Dashboard-icon.svg";
import DiscoverIcon from "../../assets/icons/Discover-icon.svg";
import PaymentIcon from "../../assets/icons/Payment-icon.svg";
import ChatIcon from "../../assets/icons/Chat-icon.svg";
import ScheduleIcon from "../../assets/icons/Schedule-icon.svg";
import ReportIcon from "../../assets/icons/Report-icon.svg";
import SettingsIcon from "../../assets/icons/Settings-icon.svg";
import LogOutIcon from "../../assets/icons/Logout-icon.svg";

const SideNav = () => {
  const [activeWindow, setActiveWindow] = useState("dashboard");
  return (
    <div className="w-full flex flex-col items-center mt-10">
      <div className="flex cursor-pointer">
        <Image src={LogoIcon} alt="Logo Icon" layout="intrinsic" />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col space-y-5  mt-8 ">
          <div
            className={`flex place-content-center h-12 w-12 cursor-pointer ${
              activeWindow === "dashboard"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("dashboard")}
          >
            <Image
              src={DashboardIcon}
              alt="Dashboard Icon"
              layout="intrinsic"
            />
          </div>
          <div
            className={`flex place-content-center h-12 w-12 cursor-pointer ${
              activeWindow === "discover"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("discover")}
          >
            <Image src={DiscoverIcon} alt="Dashboard Icon" layout="intrinsic" />
          </div>
          <div
            className={`flex place-content-center h-12 w-12 cursor-pointer ${
              activeWindow === "payment"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("payment")}
          >
            <Image src={PaymentIcon} alt="Dashboard Icon" layout="intrinsic" />
          </div>
          <div
            className={`flex place-content-center h-12 w-12 cursor-pointer ${
              activeWindow === "chat"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("chat")}
          >
            <Image src={ChatIcon} alt="Dashboard Icon" layout="intrinsic" />
          </div>
          <div
            className={`flex place-content-center   h-12 w-12 cursor-pointer ${
              activeWindow === "schedule"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("schedule")}
          >
            <Image src={ScheduleIcon} alt="Dashboard Icon" layout="intrinsic" />
          </div>
          <div
            className={`flex place-content-center h-12 w-12 cursor-pointer ${
              activeWindow === "report"
                ? "rounded-full bg-gradient-to-b from-[#DB55EC] to-[#8873FC] "
                : ""
            }`}
            onClick={() => setActiveWindow("report")}
          >
            <Image src={ReportIcon} alt="Dashboard Icon" layout="intrinsic" />
          </div>
        </div>
        <div className="flex place-content-center h-12 w-12 mt-[29vh] cursor-pointer">
          <Image
            src={SettingsIcon}
            alt="Dashboard Icon"
            width={23}
            height={23}
            layout="intrinsic"
          />
        </div>
        <div className="flex place-content-center h-12 w-12 mt-8 cursor-pointer ">
          <Image
            src={LogOutIcon}
            alt="Dashboard Icon"
            width={23}
            height={23}
            layout="intrinsic"
          />
        </div>
      </div>
    </div>
  );
};

export default SideNav;
