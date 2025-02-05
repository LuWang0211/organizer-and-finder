import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  safelist: [
    "red-500", "bg-red-500", "hover:red-500", "hover:bg-red-500",
    "yellow-500", "bg-yellow-500", "hover:yellow-500", "hover:bg-yellow-500",
    "green-700", "bg-green-700", "hover:green-700", "hover:bg-green-700",
    "blue-700", "bg-blue-700", "hover:blue-700", "hover:bg-blue-700",
    "purple-800", "bg-purple-800", "hover:purple-800", "hover:bg-purple-800",
  ]
};
export default config;
