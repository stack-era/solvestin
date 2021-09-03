import React from "react";
import HeroSection from "./components/HeroSection";
import Image from "next/image";
import Wave from "../../assets/icons/Wave.svg";
import Details from "./components/Details";

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden ">
      <HeroSection />
      <Details />
    </div>
  );
};

export default LandingPage;
