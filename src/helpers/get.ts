import { useQuery } from "react-query";
import axios from "axios";
import useReadLocalStorage from "../hooks/useReadLocalStorage";

export function getHoldings() {
  //   const publicKey = useReadLocalStorage("publicKey");
  //   console.log("publicKey", publicKey);
  return useQuery("holdings", async () => {
    const { data } = await axios.get(
      "http://194.163.160.51:7000/api/get_key_balances?key=Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"
    );
    return data;
  });
}

export function getSolvestTokens() {
  return useQuery("solvestTokens", async () => {
    const { data } = await axios.get(
      "http://194.163.160.51:7000/api/get_solvest_tokens"
    );
    return Object.entries(data).map(([key, value]: any) => ({
      ...value,
      symbol: key,
    }));
  });
}
