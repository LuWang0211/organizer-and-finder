import type { UIStylePageMeta } from "../common";
import OverlayShowcaseClient from "./OverlayShowcaseClient";

export const metadata: UIStylePageMeta = {
  title: "Overlay Showcase",
  navLabel: "Overlay",
};

export default function KittenTestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <OverlayShowcaseClient />
    </main>
  );
}
