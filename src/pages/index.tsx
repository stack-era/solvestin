import type { NextPage } from "next";
import Head from "next/head";
import Login from "../modules/Login/Login";
import SideNav from "../modules/SideNav/SideNav";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthContext } from "../auth/authContext";


const Home: NextPage = () => {
  const { isAuthenticated, setAuthentication } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard");
  }, [isAuthenticated]);
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#141417] text-white antialiased">
      <Head>
        <title>Solinvest | Login</title>
        {/* <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>

      <div className="flex h-full">
        <div className="w-[6%]  border-r border-[#2B2B2E]  ">
          <SideNav />
        </div>
        <div className="w-[90%] ">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default Home;
