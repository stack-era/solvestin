import axios from "axios";
import { useQuery } from "react-query";
import { useCustomWallet } from "../context/Wallet";

/// 01 api/get_key_balances
export function getHoldings() {
  const { walletPK } = useCustomWallet();
  return useQuery("holdings", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/get_key_balances?key=${walletPK}`
    );
    // const { data } = await axios.get(
    //   `https://solvest.in/api/get_key_balances?key=${"Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"}`
    // );
    return data;
  });
}

/// get single solvest token
export function getOneSolvestTokens(_id: Number) {
  return useQuery("OneSolvestToken", async () => {
    const { data } = await axios.get(
      "https://solvest.in/api/get_solvest_tokens"
    );
    const array = Object.entries(data).map(([key, value]: any) => ({
      ...value,
      symbol: key,
    }));
    const one = array.filter((token) => token.id === _id);

    return one;
  });
}

/// 02 /api/get_sol_balance
export function getSolBalance() {
  const { walletPK } = useCustomWallet();
  return useQuery("solBalance", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/get_sol_balance?key=${walletPK}`
    );
    // const { data } = await axios.get(
    //   `https://solvest.in/api/get_sol_balance?key=${"Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"}`
    // );
    return data;
  });
}

/// 03 /api/get_tokens
export function getTokens() {
  return useQuery("tokens", async () => {
    const { data } = await axios.get(
      "https://solvest.in/api/get_tokens?limit=5&offset=0"
    );
    return data;
  });
}

/// 04 /api/save_tokens
export function saveTokens() {
  return useQuery("tokens", async () => {
    const { data } = await axios.get("https://solvest.in/api/save_tokens");
    return data;
  });
}

/// 05 /api/get_solvest_tokens
export function getSolvestTokens() {
  return useQuery("solvestTokens", async () => {
    const { data } = await axios.get(
      "https://solvest.in/api/get_solvest_tokens"
    );
    return Object.entries(data).map(([key, value]: any) => ({
      ...value,
      symbol: key,
    }));
  });
}

/// 07 /api/get_streams
export function getStreams() {
  const { walletPK } = useCustomWallet();
  return useQuery("streams", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/get_streams?publicKey=${walletPK}`
    );
    // const { data } = await axios.get(
    //   `https://solvest.in/api/get_streams?publicKey=${"Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"}`
    // );
    return data;
  });
}

/// 08 /api/get_token_transactions
export function getTokenTransactions() {
  return useQuery("trans", async () => {
    const { data } = await axios.get(
      "https://solvest.in/api/get_token_transactions?address=So11111111111111111111111111111111111111112&limit=20&offset=0"
    );
    return data;
  });
}

/// 09 /api/user_historical_portfolio
export function getUsersHistoricalPortfolio() {
  // Remove "" from localstorage string
  const { walletPK } = useCustomWallet();
  return useQuery("historyPortfolio", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/user_historical_portfolio?publicKey=${walletPK}`
    );
    // const { data } = await axios.get(
    //   `https://solvest.in/api/user_historical_portfolio?publicKey=${"Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"}`
    // );
    return data;
  });
}

/// 10 /api/get_user_solvest_transactions?
export function getUsersSolvestTransactions() {
  // Remove "" from localstorage string
  const { walletPK } = useCustomWallet();
  return useQuery("getSolvestTransactions", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/get_user_solvest_transactions?publicKey=${walletPK}`
    );
    // const { data } = await axios.get(
    //   `https://solvest.in/api/get_user_solvest_transactions?publicKey=${"Bxp8yhH9zNwxyE4UqxP7a7hgJ5xTZfxNNft7YJJ2VRjT"}`
    // );
    return data;
  });
}

/// 12 /api/get_index_tokens
export function getIndexTokens() {
  return useQuery("IndexTokens", async () => {
    const { data } = await axios.get("https://solvest.in/api/get_index_tokens");
    return Object.entries(data).map(([key, value]: any) => ({
      ...value,
      symbol: key,
    }));
  });
}

/// 14 /solvest_tokens_chart_data
export function getSolvestChartTokensData(symbol: string) {
  return useQuery("solvest_chart_tokens", async () => {
    const { data } = await axios.get(
      `https://solvest.in/api/solvest_tokens_chart_data?symbol=${symbol}`
    );
    return data;
  });
}
