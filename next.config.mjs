/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [32, 48, 64, 96, 128, 256],
    imageSizes: [32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 2592000,
  },
  turbopack: {
    rules: {
      "*.frag": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.frag$/i,
      use: ["raw-loader"],
    });

    return config;
  },
};

export default nextConfig;
