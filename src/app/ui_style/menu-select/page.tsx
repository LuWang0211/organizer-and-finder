import type { UIStylePageMeta } from "../common";
import DemoMenuSelect from "./DemoMenuSelect";

export const metadata: UIStylePageMeta = {
  title: "Menu Select",
  navLabel: "Menu Select",
};

export default function MenuSelectShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Menu Select</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <DemoMenuSelect />
      </section>
    </main>
  );
}
