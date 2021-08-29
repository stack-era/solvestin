import React from "react";

import Holdings from "../../components/Holdings";

import { useShowBucketsContext } from "../../hooks/ShowBucketsContext";

import SearchBar from "../../components/SearchBar";

import { useActiveWindowContext } from "../../hooks/ActiveWindowContext";
import Statistics from "../Dashboard/components/Statistics";
import InvestmentBuckets from "./components/InvestmentBuckets";

const AllBuckets = () => {
  return (
    <div>
      <div className="flex">
        <div className="w-[70%]">
          <SearchBar />
          <Statistics />

          <InvestmentBuckets />
        </div>
        <div className="w-[30%] ">
          <Holdings />
        </div>
      </div>
    </div>
  );
};

export default AllBuckets;
