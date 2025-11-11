import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // sweph native modülünü bundle dışında bırak
  serverExternalPackages: ['sweph'],
};

export default nextConfig;
