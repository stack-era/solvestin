import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Image from "next/image";
import SolletIcon from "../../assets/icons/Sollet-icon.svg";
import PhantomIcon from "../../assets/icons/Phantom-icon.svg";
import SolflareIcon from "../../assets/icons/Solflare-icon.svg";
import SolanaVectorIcon from "../../assets/icons/Solana-vector-icon.svg";
import { useAuthContext } from "../../auth/authContext";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import useLocalStorage from "../../hooks/useLocalStorage";
import axios from "axios";

const Login = () => {
  const { setAuthentication } = useAuthContext();
  return (
    <div className="relative flex flex-col justify-center items-center  mt-10 ">
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
        {/* <button className="flex items-center justify-center pr-6 w-[404px] h-[61px] bg-gradient-to-b from-[#AB78FF] to-[#4F4AFF] rounded-lg __login-button-title font-bold text-lg tracking-wide cursor-pointer active:opacity-70">
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
        </button> */}
        <WalletButtons />
      </div>
      <div className="absolute bottom-[-26rem] right-24 z-0">
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

const WalletButtons = () => {
  const { wallets } = useWallet();
  return (
    <>
      {wallets.map((wal, index) => {
        return <SingleWalletButton key={index} wallet={wal} />;
      })}
    </>
  );
};

interface ISingleWalletButton {
  wallet: {
    name: WalletName;
    icon: string;
  };
  // onClick: (e: MouseEventHandler<HTMLDivElement>) => void;
}
const SingleWalletButton = (props: ISingleWalletButton) => {
  const { wallet } = props;
  const { adapter } = useWallet();
  const { setAuthentication } = useAuthContext();

  const [publicKey, setPublikKey] = useLocalStorage("publicKey", "null");

  // const history = useHistory();
  const { select } = useWallet();

  const content = useMemo(() => {
    if (adapter?.connecting) return "Connecting ...";
    if (adapter?.connected) return "Connected";
    if (wallet) return `login with ${wallet.name}`;
    return "Connect Wallet";
  }, [adapter, wallet]);

  const handleClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      select(wallet.name);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      if (!event.defaultPrevented)
        adapter
          ?.connect()
          .then(() => {
            console.log("in then");
            setAuthentication(true);
            // history.push("/dashboard");
            // console.log("key login", adapter.publicKey?.toBase58());

            if (adapter.publicKey) {
              setPublikKey(adapter.publicKey?.toBase58());
              axios
                .post(
                  `http://194.163.160.51:7000/api/save_userKey?key=${adapter.publicKey?.toBase58()}`
                )
                .then((response) =>
                  console.log("save user publickey", response.data.message)
                )
                .catch((err) => console.log("save user publickey Error", err));
            }
          })
          .catch((error) => {
            console.log("error here", error);
          });
    },
    []
  );

  // useEffect(() => {
  //   const fetchAndSetPbAddress = async () => {
  //     // console.log("pb", publicKey?.toString());
  //     // const pbKey: string = await publicKey?.toString();
  //     // setLocalStorage(pbKey);
  //     // setPublicAddress(publicKey?.toString());
  //     // history.push("/dashboard");
  //   };
  //   if (adapter?.connected) {
  //     fetchAndSetPbAddress();
  //   }
  // }, [adapter?.connected]);
  return (
    <div onClick={handleClick} className="my-4">
      <button
        className={`flex items-center justify-center  pr-6 w-[404px] h-[61px]  rounded-lg __login-button-title font-bold text-lg tracking-wide cursor-pointer active:opacity-70 bg-gradient-to-b 
        ${wallet.name === "Sollet" && " from-[#FFB84F] to-[#FF374E]"} 
         ${wallet.name === "Phantom" && " from-[#C9FF56] to-[#0CE255]"} `}
      >
        <div className="flex place-content-center h-7 w-12  ">
          <Image
            src={wallet.icon}
            alt="Sollet Icon"
            width={23}
            height={19}
            layout="intrinsic"
          />
        </div>
        LOGIN WITH <span className="uppercase ml-1">{wallet.name} </span>
      </button>
    </div>
  );
};
