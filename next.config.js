/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ["miro.medium.com", "localhost"],
  },
  env: {
    BACKEND_URL: "http://localhost:3001",
  },
};

module.exports = nextConfig;
