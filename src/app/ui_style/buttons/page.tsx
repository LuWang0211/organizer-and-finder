import { Button } from "@/ui/components/Button";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Buttons",
  navLabel: "Buttons",
};

export default function ButtonsShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Buttons</h1>

      <section className="flex flex-col items-center gap-6 w-full">
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>

          <div className="flex flex-col gap-2 items-center">
            <h3 className="text-lg font-semibold text-white/80">
              Disabled States
            </h3>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Button variant="primary" disabled>
                Primary Disabled
              </Button>
              <Button variant="secondary" disabled>
                Secondary Disabled
              </Button>
              <Button variant="outline" disabled>
                Outline Disabled
              </Button>
              <Button variant="ghost" disabled>
                Ghost Disabled
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
