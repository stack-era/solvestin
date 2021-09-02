import "../sass/global.scss";
import "tailwindcss/tailwind.css";
import "react-toastify/dist/ReactToastify.min.css";

import type { AppProps } from "next/app";
import AppContextProvider from "../auth/authContext";
import { QueryClient, QueryClientProvider } from "react-query";

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <AppContextProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </AppContextProvider>
  );
}
export default MyApp;
