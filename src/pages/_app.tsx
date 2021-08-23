import "tailwindcss/tailwind.css";
import "../sass/global.scss";
import type { AppProps } from "next/app";
import AppContextProvider from "../auth/authContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Component {...pageProps} />
    </AppContextProvider>
  );
}
export default MyApp;
