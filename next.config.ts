import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Sementara: form gallery/cover masih terima URL foto bebas dari
        // user (belum ada upload Cloudinary), jadi domain gambar belum
        // bisa dibatasi ke satu host. Persempit ke res.cloudinary.com saja
        // begitu upload Cloudinary jadi satu-satunya cara masukkan foto.
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
