import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/components/Tabs";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Tabs",
  navLabel: "Tabs",
};

export default function TabsShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Tabs</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Tab One</TabsTrigger>
            <TabsTrigger value="tab2">Tab Two</TabsTrigger>
            <TabsTrigger value="tab3">Tab Three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
              <CardHeader>
                <CardTitle>Tab One Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is the content for Tab One. It uses the updated Card
                  style for consistency.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
              <CardHeader>
                <CardTitle>Tab Two Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  This is the content for Tab Two. Try switching tabs to see the
                  transitions.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
              <CardHeader>
                <CardTitle>Tab Three Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  All tabs and cards share the same cartoonish, playful style as
                  your buttons.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
