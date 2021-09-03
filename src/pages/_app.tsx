import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "tailwindcss/tailwind.css";
import AppContextProvider from "../auth/authContext";
import "../sass/global.scss";

const Providers = dynamic(() => import("../context/Providers"), { ssr: false });

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <Providers>
          <Component {...pageProps} />
        </Providers>
      </QueryClientProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AppContextProvider>
  );
}
export default MyApp;
