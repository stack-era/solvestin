import React from "react";
import Holdings from "../../components/Holdings";
import SearchBar from "../../components/SearchBar";
import Statistics from "../Tokens/components/Statistics";
import InvestmentHistory from "./components/InvestmentHistory";
import YourPayments from "./components/YourPayments";

const UserProfile = () => {
  return (
    <div className="">
      <div className="flex">
        <div className="__tokens_tokensDashboard-hide-scroll w-[70%] overflow-y-scroll h-[100vh] pb-20 ">
          <SearchBar />
          <Statistics />
          <YourPayments />
          <InvestmentHistory />
        </div>
        <div className="w-[30%]  ">
          <Holdings />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
