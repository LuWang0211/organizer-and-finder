import { type HouseholdIconKey, IconV2 } from "@/ui/components/IconV2";

// All available household icons
const HOUSEHOLD_ICONS: HouseholdIconKey[] = [
  "book",
  "bookshelf",
  "glasses",
  "mug",
  "nightstand",
  "pajamas",
  "remote",
  "laptop",
];

// Frame shape options
const FRAME_SHAPES = ["rounded", "circle"] as const;

// Variant options
const VARIANTS = ["default", "primary", "secondary", "orange", "wood"] as const;

// Size options
const SIZES = ["tiny", "default", "lg"] as const;

export default function IconV2Page() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12 px-4">
      <h1 className="text-3xl font-extrabold text-center">IconV2 Showcase</h1>
      <p className="text-muted-foreground text-center max-w-2xl">
        PNG-based icon component with customizable frame shapes and background
        variants. Uses icons from{" "}
        <code className="bg-muted px-2 py-1 rounded">
          /icons/household_items/
        </code>
      </p>

      {/* All Household Icons */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">All Household Icons</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {HOUSEHOLD_ICONS.map((iconKey) => (
            <div key={iconKey} className="flex flex-col items-center gap-2">
              <IconV2 iconKey={iconKey} />
              <span className="text-sm font-medium capitalize">{iconKey}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Frame Shape Variants */}
      <section className="flex flex-col items-center gap-4 w-full max-w-2xl">
        <h2 className="text-2xl font-bold">Frame Shape Variants</h2>
        <div className="grid grid-cols-2 w-full">
          {FRAME_SHAPES.map((shape) => (
            <div key={shape} className="flex flex-col items-center gap-2">
              <h3 className="text-lg font-semibold capitalize">
                {shape} Frame
              </h3>
              <div className="flex gap-4 flex-wrap justify-center">
                <IconV2 frameShape={shape} iconKey="mug" />
                <IconV2 frameShape={shape} variant="primary" iconKey="book" />
                <IconV2
                  frameShape={shape}
                  variant="secondary"
                  iconKey="glasses"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Background Color Variants */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Background Color Variants</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {VARIANTS.map((variant) => (
            <div key={variant} className="flex flex-col items-center gap-2">
              <IconV2 variant={variant} iconKey="pajamas" />
              <span className="text-sm font-medium capitalize">{variant}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Borderless Examples */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Borderless Variants</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-4">
              <IconV2 border="none" variant="default" iconKey="nightstand" />
              <IconV2 border="none" variant="primary" iconKey="bookshelf" />
              <IconV2 border="none" variant="secondary" iconKey="mug" />
            </div>
            <span className="text-sm font-medium">Rounded Frame</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-4">
              <IconV2
                frameShape="circle"
                border="none"
                variant="wood"
                iconKey="pajamas"
              />
              <IconV2
                frameShape="circle"
                border="none"
                variant="secondary"
                iconKey="remote"
              />
              <IconV2
                frameShape="circle"
                border="none"
                variant="orange"
                iconKey="glasses"
              />
            </div>
            <span className="text-sm font-medium">Circle Frame</span>
          </div>
        </div>
      </section>

      {/* Size Variants */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Size Variants</h2>
        <div className="flex items-end gap-6 flex-wrap justify-center">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <IconV2 size={size} iconKey="remote" />
              <span className="text-sm font-medium capitalize">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Size Comparison by Variant */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Size Comparison by Variant</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50"
            >
              <h4 className="text-sm font-semibold capitalize">{variant}</h4>
              <div className="flex gap-2 items-end">
                {SIZES.map((size) => (
                  <IconV2
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                    iconKey="bookshelf"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Combined Examples - Rounded Frame */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Rounded Frame - All Combinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50"
            >
              <h4 className="text-sm font-semibold capitalize">{variant}</h4>
              <div className="flex gap-2">
                {HOUSEHOLD_ICONS.slice(0, 4).map((iconKey) => (
                  <IconV2
                    key={`${variant}-${iconKey}`}
                    frameShape="rounded"
                    variant={variant}
                    size="default"
                    iconKey={iconKey}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Combined Examples - Circle Frame */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Circle Frame - All Combinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
          {VARIANTS.map((variant) => (
            <div
              key={variant}
              className="flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50"
            >
              <h4 className="text-sm font-semibold capitalize">{variant}</h4>
              <div className="flex gap-2">
                {HOUSEHOLD_ICONS.slice(0, 4).map((iconKey) => (
                  <IconV2
                    key={`${variant}-${iconKey}`}
                    frameShape="circle"
                    variant={variant}
                    size="default"
                    iconKey={iconKey}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Icon Ratio Demo */}
      <section className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <h2 className="text-2xl font-bold">Icon Ratio (PNG Size Adjustment)</h2>
        <p className="text-muted-foreground text-center max-w-2xl">
          Adjust iconRatio to control the PNG size within the frame (0.2 to 1.0)
        </p>
        <div className="flex items-end gap-6 flex-wrap justify-center">
          {[0.4, 0.6, 0.8, 1.0].map((ratio) => (
            <div key={ratio} className="flex flex-col items-center gap-2">
              <IconV2 iconKey="book" iconRatio={ratio} size="lg" />
              <span className="text-sm font-medium">ratio: {ratio}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Usage Example</h2>
        <div className="bg-card p-6 rounded-lg w-full">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { IconV2 } from "@/ui/components/IconV2";

// Basic usage with household icon
<IconV2 iconKey="mug" />

// With custom frame shape and variant
<IconV2 frameShape="circle" variant="primary" iconKey="book" />

// Borderless with wood variant
<IconV2 frameShape="rounded" variant="wood" border="none" iconKey="glasses" />

// Different sizes
<IconV2 size="tiny" iconKey="remote" />
<IconV2 size="default" iconKey="remote" />
<IconV2 size="lg" iconKey="remote" />

// Custom icon ratio (0.2 to 1.0)
<IconV2 iconKey="book" iconRatio={0.8} />

// Custom image source
<IconV2 src="/custom/path/to/icon.png" alt="Custom Icon" />`}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
