import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["unpdf", "@prisma/client", "prisma"],
};

export default nextConfig;
