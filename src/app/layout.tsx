import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Organizer and Finder",
  description: "Organizer and Finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preload" href="/assets/texture/background.png" as="image" />
        <link rel="preload" href="/assets/texture/grid.png" as="image" />
      </Head>
      <body className={`${inter.className}`} style={{
        backgroundImage: "url(/assets/texture/background.png)",
        backgroundSize: "100vw 100vh"
      }}>
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-repeat" style={{
          backgroundImage: "url(/assets/texture/grid.png)",
        }}>
          {children}
        </div>
      </body>
    </html>
  );
}
