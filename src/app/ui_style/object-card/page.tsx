"use client";

import { ObjectCard } from "@/ui/components/ObjectCard";

export default function ObjectCardDemoPage() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-['Patrick_Hand',cursive] text-4xl font-bold text-[#4a3b2a] text-center mb-8">
          ObjectCard Component Demo
        </h1>

        {/* Info Variants - showing different info combinations */}
        <div className="mb-8">
          <h2 className="font-['Patrick_Hand',cursive] text-2xl font-bold text-[#4a3b2a] mb-4 text-center">
            Info Variants
          </h2>

          {/* Row 1: Full info - title + detail + extraInfo + extraInfo2 */}
          <div className="mb-6">
            <h3 className="font-['Patrick_Hand',cursive] text-lg font-bold text-[#6b5d4f] mb-3 text-center">
              Full Info (all fields)
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <ObjectCard
                iconKey="book"
                title="Harry Potter Book"
                detail="Reading"
                extraInfo="x3"
                extraInfo2="Ref: ABC123"
              />
              <ObjectCard
                iconKey="remote"
                title="TV Remote"
                detail="Living Room"
                extraInfo="x1"
                extraInfo2="In another object"
              />
            </div>
          </div>

          {/* Row 2: Partial info - title + detail + extraInfo (no extraInfo2) */}
          <div className="mb-6">
            <h3 className="font-['Patrick_Hand',cursive] text-lg font-bold text-[#6b5d4f] mb-3 text-center">
              Partial Info (no extraInfo2)
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
            <h3 className="font-['Patrick_Hand',cursive] text-lg font-bold text-[#6b5d4f] mb-3 text-center">
              No Extra Info (title + detail only)
            </h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <ObjectCard iconKey="laptop" title="Laptop" detail="Work Desk" />
              <ObjectCard iconKey="mug" title="Mug" detail="Ceramic" />
              <ObjectCard iconKey="glasses" title="Glasses" />
            </div>
          </div>
        </div>

        {/* Card Size Variants with Icons */}
        <div className="mb-10">
          <h2 className="font-['Patrick_Hand',cursive] text-2xl font-bold text-[#4a3b2a] mb-6 text-center">
            Card Size Variants (all use iconRatio={1})
          </h2>
          <div className="flex flex-wrap gap-6 justify-center items-end">
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              title="Small Card"
              detail="90px height"
            />
            <ObjectCard
              size="md"
              iconKey="pajamas"
              title="Medium Card"
              detail="100px height"
            />
            <ObjectCard
              size="lg"
              iconKey="pajamas"
              title="Large Card"
              detail="110px height"
            />
          </div>
        </div>

        {/* Icon Ratio Variants - all on same sm card to compare */}
        <div className="mb-8">
          <h2 className="font-['Patrick_Hand',cursive] text-2xl font-bold text-[#4a3b2a] mb-4 text-center">
            Icon Ratio Variants (all on sm card)
          </h2>
          <div className="flex flex-wrap gap-4 items-start justify-center">
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={0.6}
              title="ratio 0.6"
              detail="30px"
            />
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={1}
              title="ratio 1.0"
              detail="50px"
            />
            <ObjectCard
              size="sm"
              iconKey="pajamas"
              iconRatio={1.4}
              title="ratio 1.4"
              detail="70px"
            />
          </div>
        </div>

        {/* Custom Icon Source */}
        <div className="mb-8">
          <h2 className="font-['Patrick_Hand',cursive] text-2xl font-bold text-[#4a3b2a] mb-4 text-center">
            Custom Icon (using iconSrc prop)
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <ObjectCard
              size="lg"
              iconSrc="/icons/household_items/icon-book.png"
              title="Custom Icon"
              detail="Using iconSrc"
              extraInfo="x1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
