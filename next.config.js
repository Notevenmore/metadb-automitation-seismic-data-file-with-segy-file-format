/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    backend_url: 'http://localhost:8080/api/v1',
    OCR_SERVICE_URL: 'http://localhost:5000',
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    });
    return config;
  },
  swcMinify: true,
  transpilePackages: [
    '@bokeh/bokehjs',
    'react-syntax-highlighter',
    'lodash-es',
  ],
};

module.exports = nextConfig;
