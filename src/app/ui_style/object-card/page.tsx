"use client";

import { ObjectCard } from "@/ui/components/ObjectCard";

export default function ObjectCardDemoPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground text-center mb-8">
          ObjectCard Component Demo
        </h1>

        {/* Info Variants - showing different info combinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Info Variants
          </h2>

          {/* Row 1: Full info - title + detail + extraInfo + extraFootNote */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white/80 mb-3 text-center">
              Full Info (all fields)
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <ObjectCard
                iconKey="book"
                title="Harry Potter Book"
                detail="Reading"
                extraInfo="x3"
                extraFootNote="Ref: ABC123"
              />
              <ObjectCard
                iconKey="remote"
                title="TV Remote"
                detail="Living Room"
                extraInfo="x1"
                extraFootNote="In another object"
              />
            </div>
          </div>

          {/* Row 2: Partial info - title + detail + extraInfo (no extraFootNote) */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white/80 mb-3 text-center">
              Partial Info (no extraFootNote)
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <ObjectCard
                iconKey="mug"
                title="Coffee Mug"
                detail="Kitchen Cabinet"
                extraInfo="x2"
              />
              <ObjectCard
                iconKey="glasses"
                title="Reading Glasses"
                detail="Nightstand"
                extraInfo="x1"
              />
              <ObjectCard
                iconKey="nightstand"
                title="Bedroom Nightstand"
                detail="Top Drawer"
                extraInfo="5 items"
              />
            </div>
          </div>

          {/* Row 3: No extra info - only title + detail */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white/80 mb-3 text-center">
              No Extra Info (title + detail only)
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <ObjectCard iconKey="laptop" title="Laptop" detail="Work Desk" />
              <ObjectCard iconKey="mug" title="Mug" detail="Ceramic" />
              <ObjectCard iconKey="glasses" title="Glasses( long content )" />
            </div>
          </div>
        </div>

        {/* Card Size Variants with Icons */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Card Size Variants (all use iconRatio={1})
          </h2>
          <div className="flex flex-wrap gap-6 justify-center items-end">
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              title="Small Card"
              detail="default size"
            />
            <ObjectCard size="md" iconKey="pajamas" title="Medium Card" />
            <ObjectCard size="lg" iconKey="pajamas" title="Large Card" />
          </div>
        </div>

        {/* Icon Ratio Variants - all on same sm card to compare */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Icon Ratio Variants (all on sm card)
          </h2>
          <div className="flex flex-wrap gap-4 items-start justify-center">
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={0.6}
              title="ratio 0.8"
              detail="smalrer icon ratio/size"
            />
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={1}
              title="ratio 1.0"
              detail="default icon ratio/size"
            />
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={1.4}
              title="ratio 1.4"
              detail="larger icon ratio/size"
            />
          </div>
        </div>

        {/* Custom Icon Source */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Custom Icon (using iconSrc prop)
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <ObjectCard
              size="lg"
              iconSrc="/icons/household_items/icon-book.png"
              title="Custom Icon"
              detail="Using iconSrc, large icon size to show details"
              extraInfo="x1"
            />
          </div>
        </div>

        {/* Usage Example */}
        <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground">Usage Example</h2>
          <div className="bg-card-default p-6 rounded-lg w-full">
            <pre className="text-sm overflow-x-auto">
              <code>{`import { ObjectCard } from "@/ui/components/ObjectCard";

// Basic usage with household icon
<ObjectCard iconKey="book" title="Harry Potter" detail="Reading" />

// With size variants
<ObjectCard size="sm" iconKey="mug" title="Coffee Mug" />
<ObjectCard size="md" iconKey="mug" title="Coffee Mug" />
<ObjectCard size="lg" iconKey="mug" title="Coffee Mug" />

// With all info fields
<ObjectCard
  iconKey="remote"
  title="TV Remote"
  detail="Living Room"
  extraInfo="x1"
  extraFootNote="In another object"
/>

// With custom icon ratio
<ObjectCard iconKey="book" iconRatio={0.6} title="Small icon" />
<ObjectCard iconKey="book" iconRatio={1.4} title="Large icon" />

// With custom icon source
<ObjectCard
  iconSrc="/icons/household_items/icon-book.png"
  title="Custom Icon"
  detail="Using iconSrc prop"
/>`}</code>
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
