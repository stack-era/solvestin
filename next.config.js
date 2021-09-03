const withTM = require("next-transpile-modules")([
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-base",
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ["raw.githubusercontent.com"],
  },
});
