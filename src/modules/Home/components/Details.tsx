import React from "react";
import Image from "next/image";
import MackBookProIcon from "../../../assets/icons/MacbookPro-icon.svg";
import MackBookAirIcon from "../../../assets/icons/MacBookAir-icon.svg";
import FacebookIcon from "../../../assets/icons/Facebook-icon.svg";
import InstagramIcon from "../../../assets/icons/Instagram-icon.svg";
import YoutubeIcon from "../../../assets/icons/Youtube-icon.svg";

const Details = () => {
  return (
    <div className="bg-[#141417] overflow-x-hidden pb-20">
      <div className="flex   ">
        <div className="w-3/6 ml-[26rem]">
          <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] via-[#F477B9] to-[#F370C0] font-bold text-4xl">
            Manage your portfolio with SolVesting
          </h2>
          <h4 className="w-3/4 my-4">
            You have stumbled upon the easiest way to search, filter and
            evaluate every single Solana asset on the market. Track trending
            tokens, compare historical returns, and much more.
          </h4>
          <h3 className="underline">Explore market {">"} </h3>
        </div>
        <div className="flex justify-end w-full -mr-16 -mt-28 overflow-x-hidden">
          <Image
            src={MackBookProIcon}
            alt="Hero Section Icon"
            width={900}
            height={600}
          />
        </div>
      </div>
      <div className="flex  ml-20 mt-36 ">
        <div className="flex justify-start w-full  -mt-28 overflow-x-hidden">
          <div className="relative">
            <Image
              src={MackBookAirIcon}
              alt="Hero Section Icon"
              width={700}
              height={600}
            />
            <div className="absolute bottom-[4.5rem] right-0 w-full border border-white border-opacity-50"></div>
          </div>
        </div>
        <div className=" w-full  ">
          <div className="w-3/6">
            <h2 className=" font-bold text-4xl">
              Trade at the best price with quick response
            </h2>
            <h4 className="w-3/4 my-4">
              You have stumbled upon the easiest way to search, filter and
              evaluate every single Solana asset on the market. Track trending
              tokens, compare historical returns, and much more.
            </h4>
            <h3 className="underline">Buy assets in one click {">"} </h3>
          </div>
        </div>
      </div>
      <h3 className="text-center hover:underline">
        © SolVesting | Terms & Conditions
      </h3>
      <div className="flex items-center justify-center gap-2 mt-3 ">
        <Image
          src={FacebookIcon}
          alt="Hero Section Icon"
          width={50}
          height={50}
        />
        <Image
          src={InstagramIcon}
          alt="Hero Section Icon"
          width={50}
          height={50}
        />{" "}
        <Image
          src={YoutubeIcon}
          alt="Hero Section Icon"
          width={50}
          height={50}
        />
      </div>
    </div>
  );
};

export default Details;
