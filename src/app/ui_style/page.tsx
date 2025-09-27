import React from "react";
import { Button } from "@/ui/components/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/ui/components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/ui/components/tabs";
import { Bubble } from "@/ui/components/bubble";
import { Icon } from "@/ui/components/icon";
import LoadingCard from "@/ui/components/loading-card";
import Tooltip from "@/ui/components/tooltip";
import { Smile, Heart, Star, Home, Settings, User, Bell, Mail } from "lucide-react";

export default function UIStyleShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">UI Style Showcase</h1>

      {/* BUTTONS */}
      <section className="flex flex-col items-center gap-6 w-full">
        <h2 className="text-2xl font-bold">Buttons</h2>
        
        <div className="flex flex-col gap-6 items-center">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
          
          <div className="flex flex-col gap-2 items-center">
            <h3 className="text-lg font-semibold text-white/80">Disabled States</h3>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Button variant="primary" disabled>Primary Disabled</Button>
              <Button variant="secondary" disabled>Secondary Disabled</Button>
              <Button variant="outline" disabled>Outline Disabled</Button>
              <Button variant="ghost" disabled>Ghost Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CARD */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Fun, bold, and readable—just like the button!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This card uses the same playful border, shadow, and text outline techniques as the Button. Try hovering to see the floating shadow effect!
              </p>
              <Button variant="secondary">Action</Button>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">Footer or actions go here</span>
            </CardFooter>
          </Card>

          <Card variant="primary">
            <CardHeader>
              <CardTitle>Primary Card Variant</CardTitle>
              <CardDescription>Highlighted card with primary button styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This primary variant uses the same visual style as the primary button - with the primary accent background, white text, and inset shadows that create depth and emphasis.
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
              <CardDescription>Inspired by the floor plan selection UI!</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">
                This secondary variant matches the green-blue color from the reference image, perfect for creating vibrant floor plan cards.
              </p>
              <Button variant="primary">Select Plan</Button>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-muted-foreground">Variant: Secondary</span>
            </CardFooter>
          </Card>
          
          
        </div>
      </section>

      {/* BUBBLE */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Bubble Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <Bubble variant="default">
            <h3 className="text-xl font-bold mb-2 text-text-main">Default Bubble</h3>
            <p className="text-text-main/80">Rounded rectangle with realistic bubble appearance using box-shadow and shine effects.</p>
          </Bubble>
          
          <Bubble variant="primary">
            <h3 className="text-xl font-bold mb-2 text-white">Primary Bubble</h3>
            <p className="text-white/90">Primary variant with accent colors and enhanced bubble effects.</p>
          </Bubble>
          
          <Bubble variant="secondary">
            <h3 className="text-xl font-bold mb-2 text-text-main">Secondary Bubble</h3>
            <p className="text-text-main/80">Cyan variant inspired by your floor plan UI colors.</p>
          </Bubble>
        </div>
        
        <div className="flex gap-4 items-center justify-center">
          <Bubble variant="default" size="sm">
            <p className="text-sm font-medium text-text-main">Small</p>
          </Bubble>
          <Bubble variant="primary" size="default">
            <p className="text-base font-medium text-white">Default</p>
          </Bubble>
          <Bubble variant="secondary" size="lg">
            <p className="text-lg font-medium text-text-main">Large</p>
          </Bubble>
        </div>
      </section>

      {/* ICONS */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Color Variants</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="secondary">
                <Smile />
              </Icon>
              <Icon variant="primary">
                <Heart />
              </Icon>
              <Icon variant="orange">
                <Star />
              </Icon>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Size Variants</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="primary" size="tiny">
                <Home />
              </Icon>
              <Icon variant="primary" size="sm">
                <Settings />
              </Icon>
              <Icon variant="primary" size="default">
                <User />
              </Icon>
              <Icon variant="primary" size="lg">
                <Bell />
              </Icon>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Different Icons</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="default">
                <Bell />
              </Icon>
              <Icon variant="secondary">
                <Mail />
              </Icon>
              <Icon variant="primary">
                <Smile />
              </Icon>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 items-center justify-center flex-wrap">
          <Icon variant="secondary" size="lg">
            <Smile />
          </Icon>
          <Icon variant="primary" size="lg">
            <Heart />
          </Icon>
          <Icon variant="orange" size="lg">
            <Star />
          </Icon>
          <Icon variant="default" size="lg">
            <Home />
          </Icon>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold">Borderless Variants</h3>
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Icon variant="secondary" border="none">
              <Smile />
            </Icon>
            <Icon variant="primary" border="none">
              <Heart />
            </Icon>
            <Icon variant="orange" border="none">
              <Star />
            </Icon>
            <Icon variant="default" border="none">
              <Home />
            </Icon>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold">Tabs</h2>
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
                <p>This is the content for Tab One. It uses the updated Card style for consistency.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
              <CardHeader>
                <CardTitle>Tab Two Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>This is the content for Tab Two. Try switching tabs to see the transitions.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
              <CardHeader>
                <CardTitle>Tab Three Content</CardTitle>
              </CardHeader>
              <CardContent>
                <p>All tabs and cards share the same cartoonish, playful style as your buttons.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* LOADING CARD */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Loading Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-center ">
          <LoadingCard />
          <LoadingCard label="Fetching items…" />
          <LoadingCard label="Please wait" />
        </div>
      </section>

      {/* TOOLTIP */}
      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold">Tooltip</h2>
        <h3 className="text-lg font-semibold text-white/80">Bubble Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start justify-items-center">
          <Tooltip 
            variant="bubble"
            content={<p>Bottom tooltip content</p>}>
            <Bubble variant="secondary" size="sm" className="cursor-pointer">Hover me (bottom)</Bubble>
          </Tooltip>

          <Tooltip 
            position="top"
            variant="bubble"
            content={<p>Top tooltip content</p>}>
            <Bubble variant="secondary" size="sm" className="cursor-pointer">Hover me (top)</Bubble>
          </Tooltip>

          <Tooltip 
            position="right"
            variant="bubble"
            content={<p>Right tooltip content</p>}>
            <Bubble variant="secondary" size="sm" className="cursor-pointer">Hover me (right)</Bubble>
          </Tooltip>

          <Tooltip 
            position="left"
            variant="bubble"
            content={<p>Left tooltip content</p>}>
            <Bubble variant="secondary" size="sm" className="cursor-pointer">Hover me (Left)</Bubble>
          </Tooltip>
        </div>

        <h3 className="text-lg font-semibold text-white/80 mt-6">Card Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full items-start justify-items-center">
          <Tooltip 
            variant="card"
            content={"Bottom card tooltip"}
            avoidCollisions={false}
            >
            <Bubble variant="default" size="sm" className="cursor-pointer">Hover me (bottom)</Bubble>
          </Tooltip>

          <Tooltip 
            position="top"
            variant="card"
            content={"Top card tooltip"}>
            <Bubble variant="default" size="sm" className="cursor-pointer">Hover me (top)</Bubble>
          </Tooltip>

          <Tooltip 
            position="right"
            variant="card"
            content={"Right card tooltip"}>
            <Bubble variant="default" size="sm" className="cursor-pointer">Hover me (right)</Bubble>
          </Tooltip>

          <Tooltip 
            position="left"
            variant="card"
            content={"Left card tooltip"}>
            <Bubble variant="default" size="sm" className="cursor-pointer">Hover me (left)</Bubble>
          </Tooltip>
        </div>
      </section>
    </main>
  );
}
