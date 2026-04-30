"use client";

import debounce from "lodash/debounce";
import { Grid3x3, Home, Package } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useMeasure } from "react-use";
import { Tabs, TabsList, TabsTrigger } from "@/ui/components/Tabs";

export interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
}

export interface BottomNavigationProps {
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { href: "/", icon: Home, label: "Welcome" },
  { href: "/house_layout", icon: Grid3x3, label: "House Layout" },
  { href: "/add_item", icon: Package, label: "Inventory" },
];

const visibleRoutes = defaultItems.map((item) => item.href);
const PEEK_HEIGHT = 14;
const COLLAPSE_DELAY_MS = 180;

export function BottomNavigation({
  items = defaultItems,
}: BottomNavigationProps) {
  const pathname = usePathname();
  const shouldShow = Boolean(
    pathname &&
      visibleRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      ),
  );

  if (!shouldShow) {
    return null;
  }

  return <BottomNavigationContent items={items} pathname={pathname} />;
}

function BottomNavigationContent({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [panelMeasure, { height: panelHeight }] = useMeasure<HTMLDivElement>();
  const interactionTypeRef = React.useRef<
    "mouse" | "touch" | "pen" | "keyboard" | null
  >(null);

  const activeItem = items.find((item) => isItemActive(item.href, pathname));
  const activeValue = activeItem?.href ?? items[0]?.href ?? "";

  const collapse = React.useMemo(
    () =>
      debounce(() => {
        setIsExpanded(false);
      }, COLLAPSE_DELAY_MS),
    [],
  );

  React.useEffect(() => {
    return () => {
      collapse.cancel();
    };
  }, [collapse]);

  const collapseOffset = Math.max(panelHeight - PEEK_HEIGHT, 0);

  const expand = () => {
    collapse.cancel();
    setIsExpanded(true);
  };

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center"
      aria-label="Main navigation"
    >
      <motion.div
        ref={panelMeasure}
        className="relative"
        animate={{
          y: isExpanded ? 0 : collapseOffset,
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
        onPointerEnter={expand}
        onPointerLeave={collapse}
      >
        <div className="relative inline-flex flex-col items-stretch justify-center rounded-full overflow-visible border-4 border-border bg-card-default px-1.5 py-0.5 gap-0">
          <div className="absolute left-1/2 top-[0.5px] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <button
              type="button"
              aria-label={
                isExpanded ? "Collapse navigation" : "Expand navigation"
              }
              aria-expanded={isExpanded}
              onPointerDown={(event) => {
                interactionTypeRef.current = event.pointerType;
              }}
              onKeyDown={() => {
                interactionTypeRef.current = "keyboard";
              }}
              onClick={() => {
                const interactionType = interactionTypeRef.current;
                if (interactionType === "mouse") {
                  setIsExpanded(true);
                  return;
                }
                setIsExpanded((current) => !current);
              }}
              className="relative flex h-6 w-16 items-center justify-center overflow-hidden rounded-full transition-colors duration-200"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full border-4 border-border border-b-0 bg-card-default"
              />
              <span className="h-1 w-10 rounded-full bg-foreground/70 absolute" />
            </button>
          </div>
          <Tabs value={activeValue} className="relative">
            <TabsList className="border-0 bg-transparent shadow-none rounded-none">
              {items.map((item) => (
                <BottomNavigationItem key={item.href} item={item} />
              ))}
            </TabsList>
          </Tabs>
        </div>
      </motion.div>
    </nav>
  );
}

function isItemActive(href: string, pathname: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

function BottomNavigationItem({ item }: { item: NavItem }) {
  return (
    <TabsTrigger value={item.href} className="min-w-0" asChild>
      <Link href={item.href}>
        <item.icon size={20} strokeWidth={2.5} className="shrink-0" />
        <span>{item.label}</span>
      </Link>
    </TabsTrigger>
  );
}
