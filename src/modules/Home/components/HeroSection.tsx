import React from "react";
import Image from "next/image";
import HeroSectionIcon from "../../../assets/icons/HeroSection-icon.svg";
import CheckIcon from "../../../assets/icons/Check-icon.svg";

const HeroSection = () => {
  return (
    <div className="h-full bg-gradient-to-b from-[#420741] to-[#49327B] __text-cario z-50 ">
      <div className="__text-cario flex flex-col items-center p-3 opacity-80">
        <h1 className="font-bold text-3xl">SolVesting</h1>
        <h6 className="text-sm mt-3">Let’s manage your investments now !</h6>
      </div>

      <div className="grid grid-cols-2 mx-56 mt-10 ">
        <div className="flex justify-end mr-12">
          <Image
            src={HeroSectionIcon}
            alt="Hero Section Icon"
            width={500}
            height={500}
          />
        </div>
        <div className="mt-10 space-y-3">
          <div className="flex items-center gap-3">
            <Image
              src={CheckIcon}
              alt="Hero Section Icon"
              width={20}
              height={20}
            />
            <h4 className="bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] via-[#F477B9] to-[#F370C0] font-bold text-3xl">
              Mannaging Portfolio
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={CheckIcon}
              alt="Hero Section Icon"
              width={20}
              height={20}
            />
            <h4 className="bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] via-[#F477B9] to-[#F370C0] font-bold text-3xl">
              Investing
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={CheckIcon}
              alt="Hero Section Icon"
              width={20}
              height={20}
            />
            <h4 className="bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] via-[#F477B9] to-[#F370C0] font-bold text-3xl">
              Easy Access
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <Image
              src={CheckIcon}
              alt="Hero Section Icon"
              width={20}
              height={20}
            />
            <h4 className="bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] via-[#F477B9] to-[#F370C0] font-bold text-3xl">
              Being awsome
            </h4>
          </div>
          <div className="__text-cario ml-7">
            <h3 className="font-bold text-3xl w-56  opacity-80">
              all at one place with SolVesting
            </h3>
            <button className="ring-1 ring-[#EE4EE8] ring-opacity-80 rounded-lg p-2 mt-5 font-bold text-xl">
              Connect Wallet
            </button>
            <h5 className="text-lg font-semibold cursor-pointer">
              or view a demo{" "}
            </h5>
          </div>
        </div>
      </div>
      <div className="-mt-48">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#141417"
            fill-opacity="1"
            d="M0,224L80,202.7C160,181,320,139,480,154.7C640,171,800,245,960,240C1120,235,1280,149,1360,106.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
