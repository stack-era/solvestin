import {
  BaseSignerWalletAdapter,
  SignerWalletAdapter,
  WalletAdapter,
} from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";
import axios from "axios";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import SolanaVectorIcon from "../../assets/icons/Solana-vector-icon.svg";
import { useAuthContext } from "../../auth/authContext";
import { useCustomWallet } from "../../context/Wallet";
import useLocalStorage from "../../hooks/useLocalStorage";

const Login = () => {
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
        return (
          <SingleWalletButton key={index} wallet={wal} adapter={wal.adapter} />
        );
      })}
    </>
  );
};

interface ISingleWalletButton {
  wallet: {
    name: WalletName;
    icon: string;
  };
  adapter: () => WalletAdapter | SignerWalletAdapter;
}

const SingleWalletButton = (props: ISingleWalletButton) => {
  const { wallet, adapter } = props;
  const { setAuthentication } = useAuthContext();
  const { setActiveWallet } = useCustomWallet();

  const [_, setPublikKey] = useLocalStorage("publicKey", "null");

  const onClick = async () => {
    const _adapter = adapter() as BaseSignerWalletAdapter;
    await _adapter.connect();

    if (_adapter.connected && _adapter.publicKey) {
      axios
        .post(
          `https://solvest.in/api/save_userKey?key=${_adapter.publicKey.toString()}`
        )
        .then(() => {
          setActiveWallet(_adapter);
          setAuthentication(true);
          if (_adapter.publicKey) setPublikKey(_adapter.publicKey.toBase58());

          toast("👍 Connected, Ready to Invest!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        })
        .catch((e) => {
          toast.error(e.message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    }
  };

  return (
    <div className="my-4">
      <button
        className={`flex items-center justify-center  pr-6 w-[404px] h-[61px]  rounded-lg __login-button-title font-bold text-lg tracking-wide cursor-pointer active:opacity-70 bg-gradient-to-b 
        ${wallet.name === "Sollet" && " from-[#FFB84F] to-[#FF374E]"} 
         ${wallet.name === "Phantom" && " from-[#C9FF56] to-[#0CE255]"} `}
        onClick={onClick}
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
