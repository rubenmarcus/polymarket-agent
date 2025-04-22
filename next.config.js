/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    POLYMARKET_API_URL: process.env.POLYMARKET_API_URL,
    POLYMARKET_API_KEY: process.env.POLYMARKET_API_KEY,
    ACCOUNT_ID: process.env.ACCOUNT_ID,
  },
}

module.exports = nextConfig
