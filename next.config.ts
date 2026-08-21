import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Backward compatibility: invitation lama mungkin masih memakai URL eksternal.
        // Media baru diupload ke Cloudinary. Setelah data lama dimigrasikan,
        // hostname ini bisa dipersempit ke res.cloudinary.com.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
