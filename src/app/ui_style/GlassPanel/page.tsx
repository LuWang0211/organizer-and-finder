import { GlassPanel } from "@/ui/components/GlassPanel";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "GlassPanel",
  navLabel: "GlassPanel",
};

export default function GlassPanelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-2xl font-extrabold">GlassPanel Component</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Default variant */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Default</h2>
          <GlassPanel className="h-40 flex items-center justify-center">
            <span className="text-white/80">GlassPanel Content</span>
          </GlassPanel>
        </div>

        {/* Subtle variant */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Subtle</h2>
          <GlassPanel
            variant="subtle"
            className="h-40 flex items-center justify-center"
          >
            <span className="text-white/80">GlassPanel Content</span>
          </GlassPanel>
        </div>

        {/* Strong variant */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Strong</h2>
          <GlassPanel
            variant="strong"
            className="h-40 flex items-center justify-center"
          >
            <span className="text-white/80">GlassPanel Content</span>
          </GlassPanel>
        </div>

        {/* With different padding */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Padding variants</h2>
          <div className="flex gap-2">
            <GlassPanel
              padding="none"
              className="h-20 flex-1 flex items-center justify-center"
            >
              <span className="text-white/80 text-sm">p-none</span>
            </GlassPanel>
            <GlassPanel
              padding="sm"
              className="h-20 flex-1 flex items-center justify-center"
            >
              <span className="text-white/80 text-sm">p-sm</span>
            </GlassPanel>
            <GlassPanel
              padding="lg"
              className="h-20 flex-1 flex items-center justify-center"
            >
              <span className="text-white/80 text-sm">p-lg</span>
            </GlassPanel>
            <GlassPanel
              padding="xl"
              className="h-20 flex-1 flex items-center justify-center"
            >
              <span className="text-white/80 text-sm">p-xl</span>
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
