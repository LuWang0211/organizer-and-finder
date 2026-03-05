import LoadingCard from "@/ui/components/LoadingCard";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Loading Card",
  navLabel: "Loading Card",
};

export default function LoadingCardShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Loading Card</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center ">
          <LoadingCard />
          <LoadingCard label="Fetching items…" />
          <LoadingCard label="Please wait" />
        </div>
      </section>
    </main>
  );
}
