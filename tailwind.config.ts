import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cartoonish UI palette using CSS variables
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'secondary': 'hsl(var(--secondary))',
        'primary-accent': 'hsl(var(--primary-accent))',
        'secondary-accent': 'hsl(var(--secondary-accent))',
        'highlight': 'hsl(var(--highlight))',
        'outline': 'hsl(var(--outline))',
        'confirm': 'hsl(var(--confirm))',
        'card-bg': 'hsl(var(--card-bg))',
        'shadow': 'hsl(var(--shadow))',
        'text-main': 'hsl(var(--text-main))',
        'border': 'hsl(var(--outline))',
      },
      borderColor: {
        'border': 'hsl(var(--outline))',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    "red-500", "bg-red-500", "hover:red-500", "hover:bg-red-500",
    "yellow-500", "bg-yellow-500", "hover:yellow-500", "hover:bg-yellow-500",
    "green-700", "bg-green-700", "hover:green-700", "hover:bg-green-700",
    "blue-700", "bg-blue-700", "hover:blue-700", "hover:bg-blue-700",
    "purple-800", "bg-purple-800", "hover:purple-800", "hover:bg-purple-800",
  ]
};
export default config;
