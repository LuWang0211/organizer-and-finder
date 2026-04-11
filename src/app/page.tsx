import { Leaf } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthProtectedComponent from "@/AuthProtectedComponent";
import { getSession } from "@/auth";
import { getHomeSummaryForFamily } from "@/services/homeSummaryService";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { GlassPanel } from "@/ui/components/GlassPanel";
import { Icon } from "@/ui/components/Icon";

type ActionCardProps = {
  href: string;
  iconKey: "home" | "search" | "package";
  title: string;
  description: string;
  accentClassName: string;
};

function ActionCard({
  href,
  iconKey,
  title,
  description,
  accentClassName,
}: ActionCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full min-h-[220px] overflow-hidden">
        <div className={`h-14 w-full ${accentClassName}`} />
        <CardHeader className="pb-3">
          <div className="-mt-14 mb-2 flex">
            <Icon variant="default" size="default" iconKey={iconKey} />
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-between pt-0">
          <p className="text-base font-medium text-foreground-secondary">
            {description}
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground-secondary/70">
            Open
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function GettingStartedTips({
  totalLocations,
  totalItems,
}: {
  totalLocations: number;
  totalItems: number;
}) {
  const tips =
    totalLocations === 0
      ? [
          "Start by adding your first container or location so your house has a place to organize things.",
          "Pick one easy spot first, like a drawer, shelf, or basket, to make setup feel lightweight.",
          "Once your first location exists, the house layout and inventory tools become much more useful.",
        ]
      : totalItems === 0
        ? [
            "Add a few everyday items first so search has something real to find.",
            "Good starter items are chargers, documents, pantry staples, or anything you regularly look for.",
            "Keep the first pass simple: a handful of useful items is enough to validate your setup.",
          ]
        : [
            "Try searching for a familiar item to test how quickly your setup helps you find it.",
            "Open your house layout to refine rooms and locations as your organization system grows.",
            "Keep momentum by updating inventory a little at a time instead of waiting for a perfect full reset.",
          ];

  return (
    <section className="space-y-4">
      <Card className="rounded-3xl">
        <CardContent className="pt-6">
          <div className="space-y-1 flex items-center gap-3">
            <Icon variant="highlight" size="sm" iconKey="star" />
            <h2 className="text-2xl font-extrabold text-foreground">
              Getting Started Tips
            </h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-foreground-secondary">
            {tips.map((tip) => (
              <li
                key={tip}
                className="text-sm leading-6 text-foreground-secondary"
              >
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  );
}

async function DataLoader() {
  const session = await getSession();

  if (!session?.dbUser.familyId) {
    redirect("/new_house");
  }

  const summary = await getHomeSummaryForFamily(session.dbUser.familyId);

  if (!summary.houseName) {
    redirect("/new_house");
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <section className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="space-y-3">
              <h1 className="flex items-center gap-3 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                <Icon variant="highlight" iconKey="home" />
                <span className="relative inline-block pr-4">
                  <Leaf
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 right-0 z-20 h-8 w-8 rotate-18 text-secondary-accent drop-shadow(0_4px_10px_color-mix(in_oklch,var(--color-secondary-accent)_45%,transparent)) sm:-top-4 sm:right-1 sm:h-10 sm:w-10"
                    strokeWidth={2.25}
                  />
                  <span className="text-mute">Welcome to Your </span>
                  <span className="relative z-10 bg-linear-to-r from-highlight-300 to-[color-mix(in_oklch,var(--color-primary-accent),white_25%)] bg-clip-text text-transparent">
                    {summary.houseName}
                  </span>
                </span>
              </h1>

              <p className="max-w-2xl text-base leading-7 text-mute/85 sm:text-lg">
                Organize your space, track your containers, and find things
                faster.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <GlassPanel
            padding="lg"
            variant="strong"
            className="rounded-3xl shadow-md"
          >
            <div className="flex flex-col gap-3 text-foreground sm:flex-row sm:items-center">
              <div className="flex items-center justify-center gap-4 sm:flex-1">
                <Icon variant="secondary" size="sm" iconKey="home" />
                <span className="inline-flex items-baseline gap-2 text-base font-semibold">
                  <span className="text-2xl font-extrabold text-mute">
                    {summary.totalRooms}
                  </span>
                  <span>Rooms</span>
                </span>
              </div>
              <div className="hidden text-mute/60 sm:block">|</div>
              <div className="flex items-center justify-center gap-3 sm:flex-1">
                <Icon variant="secondary" size="sm" iconKey="archive" />
                <span className="inline-flex items-baseline gap-2 text-base font-semibold">
                  <span className="text-2xl font-extrabold text-mute">
                    {summary.totalLocations}
                  </span>
                  <span>Containers</span>
                </span>
              </div>
              <div className="hidden text-mute/60 sm:block">|</div>
              <div className="flex items-center justify-center gap-3 sm:flex-1">
                <Icon variant="secondary" size="sm" iconKey="package" />
                <span className="inline-flex items-baseline gap-2 text-base font-semibold">
                  <span className="text-2xl font-extrabold text-mute">
                    {summary.totalItems}
                  </span>
                  <span>Items</span>
                </span>
              </div>
            </div>
          </GlassPanel>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold">Choose Your Next Move</h2>
            <p className="text-base">
              These are the key tools you’ll probably rely on most while
              organizing.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ActionCard
              href="/house_layout"
              iconKey="home"
              title="View House"
              description="Browse rooms, locations, and items on the map so you can understand the whole layout at a glance."
              accentClassName="bg-linear-to-r from-card-secondary-300 via-[color-mix(in_oklch,var(--color-background),white_45%)] to-mute/60"
            />
            <ActionCard
              href="/phaserui"
              iconKey="search"
              title="Search Items"
              description="Quickly find where something is stored when you need an answer instead of another scavenger hunt."
              accentClassName="bg-linear-to-r from-[color-mix(in_oklch,color-mix(in_oklch,var(--color-highlight)_60%,var(--color-secondary-accent)_40%),var(--color-mute)_40%)] via-highlight-100 to-primary-accent/35"
            />
            <ActionCard
              href="/add_item"
              iconKey="package"
              title="Manage Inventory"
              description="Add items now and keep building a searchable inventory that can grow with the rest of your house."
              accentClassName="bg-linear-to-r from-primary-accent/75 via-[hsl(from_var(--color-primary-accent)_h_s_calc(l_+_12))] to-[color-mix(in_oklch,color-mix(in_oklch,var(--color-highlight)_65%,var(--color-secondary-accent)_35%),var(--color-mute)_65%)]"
            />
          </div>
        </section>

        <GettingStartedTips
          totalLocations={summary.totalLocations}
          totalItems={summary.totalItems}
        />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthProtectedComponent>
      <DataLoader />
    </AuthProtectedComponent>
  );
}
