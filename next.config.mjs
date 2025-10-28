/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    cssChunking: "strict",
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heroui.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "framerusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
