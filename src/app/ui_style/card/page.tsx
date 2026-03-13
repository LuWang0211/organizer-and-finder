import { Button } from "@/ui/components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/components/Card";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Card",
  navLabel: "Card",
};

export default function CardShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Card</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>
                Fun, bold, and readable—just like the button!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This card uses the same playful border, shadow, and text outline
                techniques as the Button. Try hovering to see the floating
                shadow effect!
              </p>
              <Button variant="secondary">Action</Button>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">
                Footer or actions go here
              </span>
            </CardFooter>
          </Card>

          <Card variant="primary">
            <CardHeader>
              <CardTitle>Primary Card Variant</CardTitle>
              <CardDescription>
                Highlighted card with primary button styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This primary variant uses the same visual style as the primary
                button - with the primary accent background, white text, and
                inset shadows that create depth and emphasis.
              </p>
              <Button variant="secondary">Action</Button>
            </CardContent>
            <CardFooter>
              <span className="text-xs opacity-75">Variant: Primary</span>
            </CardFooter>
          </Card>

          <Card variant="secondary">
            <CardHeader>
              <CardTitle>Secondary Card Variant</CardTitle>
              <CardDescription>
                Inspired by the floor plan selection UI!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This secondary variant matches the green-blue color from the
                reference image, perfect for creating vibrant floor plan cards.
              </p>
              <Button variant="primary">Select Plan</Button>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">
                Variant: Secondary
              </span>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
