import React, { useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import RightArrow from "../../../assets/icons/Right-arrow-icon.svg";
import GreenIcon from "../../../assets/icons/Green-arrow-icon.svg";
import RedArrow from "../../../assets/icons/Red-Arrow-icon.svg";
import { useActiveWindowContext } from "../../../hooks/ActiveWindowContext";
import { getIndexTokens, getSolvestTokens } from "../../../helpers/get";

const Buckets = () => {
  const router = useRouter();
  const { activeWindow, setActiveWindow } = useActiveWindowContext();
  const { isLoading, error, data, isFetching } = getSolvestTokens();
  const {
    isLoading: isIndexTokensLoading,
    error: IndexTokensError,
    data: IndexTokens,
    isFetching: isIndexTokensFetching,
  } = getIndexTokens();
  // console.log(data)
  return (
    <div className="__text-cario ml-6 mt-12">
      <>
        <div className="flex justify-between">
          <div className="">
            <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
              Investment Buckets
            </h2>
            <h6 className="text-xs opacity-50">
              Now invest in Investment Buckets with Solana
            </h6>
          </div>
          <div className="flex place-items-center px-2 h-6 w-max  text-sm rounded-xl  bg-gradient-to-t from-[#524EEE] to-[#8162FF] cursor-pointer ">
            <p>See More</p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-nowrap mt-5 gap-5 ">
            {!isLoading &&
              data &&
              data.map((token: any, index: any) => (
                <div
                  key={index}
                  className=" w-72 bg-gradient-to-br from-[#353c465e] to-[#15151500] rounded-xl border border-[#424244] p-3 cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/tokens/${!isLoading && token ? token.id : 1}/${
                        !isLoading && token ? token.symbol : "SOLBUCKS"
                      }`
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{token.name}</h3>
                    <div className="  ">
                      <Image
                        src={RightArrow}
                        alt="Dashboard Icon"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 my-3 ">
                    <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
                      ${token.price.toFixed(3)}
                    </h2>
                    <Image
                      src={GreenIcon}
                      alt="Dashboard Icon"
                      width={12}
                      height={10}
                    />
                    <h5 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A]">
                      - 6.7%
                    </h5>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </>
      <>
        <div className="flex justify-between mt-8">
          <div className="">
            <h2 className="font-bold text-xl">Index Tokens</h2>
            <h6 className="text-xs opacity-50">
              Invest in INDEX Tokens with Solana
            </h6>
          </div>
          <div className="flex place-items-center px-2 h-6 w-max  text-sm rounded-xl  bg-gradient-to-t from-[#524EEE] to-[#8162FF] cursor-pointer ">
            <p>See More</p>
          </div>
        </div>
        <div className="">
          <div className="flex flex-nowrap mt-5 gap-5 ">
            {!isIndexTokensLoading &&
              IndexTokens &&
              IndexTokens.map((token: any, index: any) => (
                <div
                  key={index}
                  className=" w-72 bg-gradient-to-br from-[#353c465e] to-[#15151500] rounded-xl border border-[#424244] p-3 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">
                      {token.name} ({token.symbol})
                    </h3>
                    <div className="  ">
                      <Image
                        src={RightArrow}
                        alt="Dashboard Icon"
                        width={18}
                        height={18}
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 my-3 ">
                    <h2 className="bg-clip-text text-transparent bg-gradient-to-b from-[#36DDAB] to-[#00D03A] font-bold text-3xl">
                      ${token.price.toFixed(2)}
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
              ))}
          </div>
        </div>
      </>
    </div>
  );
};

export default Buckets;
