import type { UIStylePageMeta } from "../common";

type ColorToken = {
  name: string;
  swatch: string;
};

const colorTokens: ColorToken[] = [
  {
    name: "--color-background-raw",
    swatch: "hsl(var(--color-background-raw))",
  },
  {
    name: "--color-foreground-raw",
    swatch: "hsl(var(--color-foreground-raw))",
  },
  {
    name: "--color-foreground-secondary-raw",
    swatch: "hsl(var(--color-foreground-secondary-raw))",
  },
  {
    name: "--color-foreground-accent-raw",
    swatch: "hsl(var(--color-foreground-accent-raw))",
  },
  { name: "--color-mute-raw", swatch: "hsl(var(--color-mute-raw))" },
  {
    name: "--color-primary-accent-raw",
    swatch: "hsl(var(--color-primary-accent-raw))",
  },
  {
    name: "--color-secondary-accent-raw",
    swatch: "hsl(var(--color-secondary-accent-raw))",
  },
  { name: "--color-highlight-raw", swatch: "hsl(var(--color-highlight-raw))" },
  {
    name: "--color-card-default-raw",
    swatch: "hsl(var(--color-card-default-raw))",
  },
  {
    name: "--color-card-secondary",
    swatch: "var(--color-card-secondary)",
  },
  { name: "--color-shadow-raw", swatch: "hsl(var(--color-shadow-raw))" },
  { name: "--color-border-raw", swatch: "hsl(var(--color-border-raw))" },
  { name: "--color-icon-primary", swatch: "var(--color-icon-primary)" },
];

export const metadata: UIStylePageMeta = {
  title: "Colors",
  navLabel: "Colors",
};

function ColorSwatch({ name, swatch }: ColorToken) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-4 border-border bg-card-default p-4 shadow-md">
      <div
        className="h-24 w-24 rounded-xl border-2 border-black/10 shadow-inner"
        style={{ background: swatch }}
      />
      <code className="break-all text-sm font-semibold text-foreground">
        {name}
      </code>
    </div>
  );
}

export default function ColorsShowcasePage() {
  return (
    <main className="min-h-screen px-8 py-12 text-mute">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold">Colors</h1>
          <p className="max-w-3xl text-sm ">
            Swatches for the canonical color tokens defined in{" "}
            <code>src/app/globals.css</code>.
          </p>
        </div>

        <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
          {colorTokens.map((token) => (
            <ColorSwatch key={token.name} {...token} />
          ))}
        </section>
      </div>
    </main>
  );
}
