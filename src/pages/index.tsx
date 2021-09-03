import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthContext } from "../auth/authContext";
import LandingPage from "../modules/Home/LandingPage";

const HomePage: NextPage = () => {
  const { isAuthenticated, setAuthentication } = useAuthContext();
  const router = useRouter();

  return (
    <div className="text-white antialiased">
      <Head>
        <title>Solinvest | Home Page</title>
        {/* <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <LandingPage />
    </div>
  );
};

export default HomePage;
