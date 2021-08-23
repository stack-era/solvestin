import React from "react";
import Image from "next/image";
import SolletIcon from "../../assets/icons/Sollet-icon.svg";
import PhantomIcon from "../../assets/icons/Phantom-icon.svg";
import SolflareIcon from "../../assets/icons/Solflare-icon.svg";
import SolanaVectorIcon from "../../assets/icons/Solana-vector-icon.svg";

const Login = () => {
  return (
    <div className=" flex flex-col justify-center items-center  mt-10 ">
      <div className="flex flex-col items-center">
        <p className="font-bold text-5xl __login-title"> SolVesting </p>
        <p className="text-xs mt-3 text-gray-500">
          Let’s manage your investments now !
        </p>
      </div>

      <div className="flex flex-col items-center space-y-5 mt-44 z-50">
        <h3 className="font-bold text-lg __login-caption">
          Login to start investing with Solana{" "}
        </h3>
        <button className="flex items-center justify-center  pr-6 w-[404px] h-[61px] bg-gradient-to-b from-[#FFB84F] to-[#FF374E] rounded-lg __login-button-title font-bold text-lg tracking-wide ">
          <div className="flex place-content-center h-12 w-12  cursor-pointer">
            <Image
              src={SolletIcon}
              alt="Sollet Icon"
              width={23}
              height={23}
              layout="intrinsic"
            />
          </div>
          LOGIN WITH SOLLET
        </button>
        <button className="flex items-center justify-center pr-6 w-[404px] h-[61px] bg-gradient-to-b from-[#C9FF56] to-[#0CE255] rounded-lg __login-button-title font-bold text-lg tracking-wide cursor-pointer">
          <div className="flex place-content-center h-12 w-12  ">
            <Image
              src={PhantomIcon}
              alt="Sollet Icon"
              width={23}
              height={23}
              layout="intrinsic"
            />
          </div>
          LOGIN WITH PHANTOM
        </button>
        <button className="flex items-center justify-center pr-6 w-[404px] h-[61px] bg-gradient-to-b from-[#AB78FF] to-[#4F4AFF] rounded-lg __login-button-title font-bold text-lg tracking-wide cursor-pointer">
          <div className="flex place-content-center h-12 w-12  ">
            <Image
              src={SolflareIcon}
              alt="Sollet Icon"
              width={23}
              height={23}
              layout="intrinsic"
            />
          </div>
          LOGIN WITH SOLFLARE
        </button>
      </div>
      <div className="relative -top-72 -right-80 z-0">
        <Image
          src={SolanaVectorIcon}
          alt="Sollet Icon"
          width={700}
          height={700}
        />
      </div>
    </div>
  );
};

export default Login;
