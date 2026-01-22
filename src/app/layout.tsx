import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PreloadResources } from "./PreloadResources";
import { ProfileWrapper } from "./ProfileWrapper";
import "iconify-icon";

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
      <PreloadResources />
      <body
        className={`${inter.className} h-screen w-screen relative overflow-hidden`}
        style={{
          backgroundImage: "url(/assets/texture/background.png)",
          backgroundSize: "100vw 100vh",
        }}
      >
        <div
          className="absolute left-0 right-0 top-0 bottom-0 bg-repeat overflow-y-auto"
          style={{
            backgroundImage: "url(/assets/texture/grid.png)",
          }}
        >
          <ProfileWrapper />
          {children}
        </div>
      </body>
    </html>
  );
}
