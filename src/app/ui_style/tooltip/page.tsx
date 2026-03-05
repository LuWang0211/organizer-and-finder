import { Bubble } from "@/ui/components/Bubble";
import Tooltip from "@/ui/components/Tooltip";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Tooltip",
  navLabel: "Tooltip",
};

export default function TooltipShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Tooltip</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h3 className="text-lg font-semibold text-white/80">Bubble Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start justify-items-center">
          <Tooltip variant="bubble" content={<p>Bottom tooltip content</p>}>
            <Bubble variant="secondary" size="sm" className="cursor-pointer">
              Hover me (bottom)
            </Bubble>
          </Tooltip>

          <Tooltip
            position="top"
            variant="bubble"
            content={<p>Top tooltip content</p>}
          >
            <Bubble variant="secondary" size="sm" className="cursor-pointer">
              Hover me (top)
            </Bubble>
          </Tooltip>

          <Tooltip
            position="right"
            variant="bubble"
            content={<p>Right tooltip content</p>}
          >
            <Bubble variant="secondary" size="sm" className="cursor-pointer">
              Hover me (right)
            </Bubble>
          </Tooltip>

          <Tooltip
            position="left"
            variant="bubble"
            content={<p>Left tooltip content</p>}
          >
            <Bubble variant="secondary" size="sm" className="cursor-pointer">
              Hover me (Left)
            </Bubble>
          </Tooltip>
        </div>

        <h3 className="text-lg font-semibold text-white/80 mt-6">
          Card Variant
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start justify-items-center">
          <Tooltip
            variant="card"
            content={"Bottom card tooltip"}
            avoidCollisions={false}
          >
            <Bubble variant="default" size="sm" className="cursor-pointer">
              Hover me (bottom)
            </Bubble>
          </Tooltip>

          <Tooltip position="top" variant="card" content={"Top card tooltip"}>
            <Bubble variant="default" size="sm" className="cursor-pointer">
              Hover me (top)
            </Bubble>
          </Tooltip>

          <Tooltip
            position="right"
            variant="card"
            content={"Right card tooltip"}
          >
            <Bubble variant="default" size="sm" className="cursor-pointer">
              Hover me (right)
            </Bubble>
          </Tooltip>

          <Tooltip position="left" variant="card" content={"Left card tooltip"}>
            <Bubble variant="default" size="sm" className="cursor-pointer">
              Hover me (left)
            </Bubble>
          </Tooltip>
        </div>
      </section>
    </main>
  );
}
