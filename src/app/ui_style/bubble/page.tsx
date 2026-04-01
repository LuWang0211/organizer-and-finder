import { Bubble } from "@/ui/components/Bubble";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Bubble",
  navLabel: "Bubble",
};

export default function BubbleShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Bubble Components</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <Bubble variant="default">
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Default Bubble
            </h3>
            <p className="text-foreground/80">
              Rounded rectangle with realistic bubble appearance using
              box-shadow and shine effects.
            </p>
          </Bubble>

          <Bubble variant="primary">
            <h3 className="text-xl font-bold mb-2 text-white">
              Primary Bubble
            </h3>
            <p className="text-white/90">
              Primary variant with accent colors and enhanced bubble effects.
            </p>
          </Bubble>

          <Bubble variant="secondary">
            <h3 className="text-xl font-bold mb-2 text-foreground">
              Secondary Bubble
            </h3>
            <p className="text-foreground/80">
              Cyan variant inspired by your floor plan UI colors.
            </p>
          </Bubble>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <Bubble variant="default" size="sm">
            <p className="text-sm font-medium text-foreground">Small</p>
          </Bubble>
          <Bubble variant="primary" size="default">
            <p className="text-base font-medium text-white">Default</p>
          </Bubble>
          <Bubble variant="secondary" size="lg">
            <p className="text-lg font-medium text-foreground">Large</p>
          </Bubble>
        </div>
      </section>
    </main>
  );
}
