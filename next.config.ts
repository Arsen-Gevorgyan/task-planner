import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/task-planner",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;