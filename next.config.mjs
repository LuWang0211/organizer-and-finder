/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
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
