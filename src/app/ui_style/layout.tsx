"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GlassPanel } from "@/ui/components/GlassPanel";
import { cn } from "@/utils/tailwind";
import { navItems } from "./navItems";

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="h-full flex flex-col gap-2">
      <h1 className="text-xl font-bold mb-4 px-2">UI Style</h1>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "font-black"
              : "hover:bg-card hover:text-primary-accent",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

export default function UIStyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full">
      <GlassPanel className="w-56 min-w-56 h-full sticky top-0 text-white/80">
        <Navbar />
      </GlassPanel>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
