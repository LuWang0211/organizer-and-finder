import type { UIStylePageMeta } from "../common";
import SearchBarShowcaseClient from "./SearchBarShowcaseClient";

export const metadata: UIStylePageMeta = {
  title: "Search Bar",
  navLabel: "Search Bar",
};

export default function SearchBarShowcasePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <SearchBarShowcaseClient />
    </main>
  );
}
