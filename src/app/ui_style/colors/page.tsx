import type { UIStylePageMeta } from "../common";

type ColorToken = {
  name: string;
  swatch: string;
};

const colorTokens: ColorToken[] = [
  {
    name: "--color-background",
    swatch: "var(--color-background)",
  },
  {
    name: "--color-foreground",
    swatch: "var(--color-foreground)",
  },
  {
    name: "--color-foreground-secondary",
    swatch: "var(--color-foreground-secondary)",
  },
  {
    name: "--color-foreground-accent",
    swatch: "var(--color-foreground-accent)",
  },
  { name: "--color-mute", swatch: "var(--color-mute)" },
  {
    name: "--color-primary-accent",
    swatch: "var(--color-primary-accent)",
  },
  {
    name: "--color-secondary-accent",
    swatch: "var(--color-secondary-accent)",
  },
  { name: "--color-highlight", swatch: "var(--color-highlight)" },
  {
    name: "--color-card-default",
    swatch: "var(--color-card-default)",
  },
  {
    name: "--color-card-secondary",
    swatch: "var(--color-card-secondary)",
  },
  { name: "--color-shadow", swatch: "var(--color-shadow)" },
  { name: "--color-border", swatch: "var(--color-border)" },
  { name: "--color-icon-primary", swatch: "var(--color-icon-primary)" },
];

export const metadata: UIStylePageMeta = {
  title: "Colors",
  navLabel: "Colors",
};

function ColorSwatch({ name, swatch }: ColorToken) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border-4 border-border bg-card-default p-4 shadow-md items-center">
      <div
        className="h-24 w-24 rounded-xl border-5 shadow-inner"
        style={{
          background: swatch,
          borderColor: `hsl(from ${swatch} h s calc(l - 10))`,
        }}
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
