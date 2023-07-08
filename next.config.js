/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    });
    return config;
  },
  swcMinify: true,
  env: {
    NEXT_PUBLIC_OCR_SERVICE_URL: process.env.NEXT_PUBLIC_OCR_SERVICE_URL,
    NEXT_PUBLIC_BACKEND_AUTH: process.env.NEXT_PUBLIC_BACKEND_AUTH,
    ENDPOINTS: process.env.ENDPOINTS,
  }
};

module.exports = nextConfig;
