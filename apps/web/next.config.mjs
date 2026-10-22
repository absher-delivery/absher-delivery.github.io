// Static export so the site can be served from GitHub Pages (or any static host).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
export default {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@absher/shared"],
};
