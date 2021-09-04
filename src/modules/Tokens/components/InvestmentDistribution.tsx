import { useRouter } from "next/router";
import React from "react";
import { getOneSolvestTokens } from "../../../helpers/get";

const InvestmentDistribution = () => {
  const router = useRouter();
  const { token } = router.query;

  const { isLoading, error, data, isFetching } = getOneSolvestTokens(
    parseInt(token as string)
  );

  let array;

  if (data) {
    array = data[0].underlyingTokens.map((O: any) => ({
      ...(Object.values(O)[0] as any),
      symbol: Object.keys(O)[0],
    }));
    // console.log(array);
    // console.log(data[0].underlyingTokens[0].name);
  }

  // {!isLoading && data && data[0].underlyingTokens.map((token:any, index:any) => )}
  return (
    <div>
      <h2 className="__text-cario font-bold text-2xl mt-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-[#EE4EE8] to-[#FAA08A]">
        Investment Distribution
      </h2>
      <h6 className="text-sm __text-cario text-center">
        The investment distribution of the token based on percentage{" "}
      </h6>
      <div className="flex flex-col items-center mt-14">
        <table className=" w-[50%] table-auto __text-cario mb-6">
          <thead>
            <tr className="text-[#B869CC] bg-[#26262d33]  ">
              <th className="w-[33%] p-3 text-left ">Coin</th>
              <th className="w-[33%]">Price</th>
              <th className="w-[33%]">Distribution</th>
            </tr>
          </thead>

          <tbody>
            {array &&
              array.map((token: any, index: any) => (
                <tr
                  key={index}
                  className={` font-bold ${
                    (index + 1) % 2 === 0 ? "bg-[#232323]" : "bg-[#26262d33]"
                  } `}
                >
                  <td className="p-3">
                    {token.name} ({token.symbol})
                  </td>
                  <td className="text-[#36DDAB] text-center">
                    ${token.price.toFixed(2)}
                  </td>
                  <td className="text-center"> {token.weight * 100}%</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex gap-4 mb-10">
          <button className="rounded-lg text-black font-bold __text-cario text-xl capitalize bg-gradient-to-b from-[#36DDAB]  to-[#79E18A] p-2 w-[18rem] ">
            BUY {!isLoading && data && data[0].name}
          </button>
          <button className="rounded-lg text-black font-bold __text-cario text-xl capitalize bg-gradient-to-b from-[#DD5E36]  to-[#E17979] p-2 w-[18rem] ">
            SEll {!isLoading && data && data[0].name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDistribution;
