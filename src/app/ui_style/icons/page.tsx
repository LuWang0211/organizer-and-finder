import { Icon } from "@/ui/components/Icon";
import type { UIStylePageMeta } from "../common";

export const metadata: UIStylePageMeta = {
  title: "Icons",
  navLabel: "Icons",
};

export default function IconsShowcase() {
  return (
    <main className="min-h-screen flex flex-col items-center py-12 gap-12">
      <h1 className="text-3xl font-extrabold mb-4">Icons</h1>

      <section className="flex flex-col items-center gap-6 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-start">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Color Variants</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="secondary" iconKey="smile" />
              <Icon variant="primary" iconKey="heart" />
              <Icon variant="highlight" iconKey="star" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Size Variants</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="primary" size="tiny" iconKey="home" />
              <Icon variant="primary" size="sm" iconKey="settings" />
              <Icon variant="primary" size="medium" iconKey="search" />
              <Icon variant="primary" size="default" iconKey="user" />
              <Icon variant="primary" size="lg" iconKey="bell" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-bold">Different Icons</h3>
            <div className="flex gap-4 items-center justify-center">
              <Icon variant="default" iconKey="bell" />
              <Icon variant="secondary" iconKey="mail" />
              <Icon variant="primary" iconKey="smile" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 items-center justify-center flex-wrap">
          <Icon variant="secondary" size="lg" iconKey="smile" />
          <Icon variant="primary" size="lg" iconKey="heart" />
          <Icon variant="highlight" size="lg" iconKey="star" />
          <Icon variant="default" size="lg" iconKey="home" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-bold">Borderless Variants</h3>
          <div className="flex gap-4 items-center justify-center flex-wrap">
            <Icon variant="secondary" border="none" iconKey="smile" />
            <Icon variant="primary" border="none" iconKey="heart" />
            <Icon variant="highlight" border="none" iconKey="star" />
            <Icon variant="default" border="none" iconKey="home" />
          </div>
        </div>
      </section>
    </main>
  );
}
