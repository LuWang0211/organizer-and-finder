"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems } from "./navItems";

function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-56 min-w-56 h-screen border-r border-border bg-background p-4 flex flex-col gap-2 sticky top-0">
      <h1 className="text-xl font-bold mb-4 px-2">UI Style</h1>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
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
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
