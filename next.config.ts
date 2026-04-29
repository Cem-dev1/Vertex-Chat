/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "*.ufs.sh", // Yeni hata veren domaini bu şekilde kapsıyoruz
      },
    ],
  },
};

export default nextConfig;