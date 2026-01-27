import type { PropsWithChildren } from "react";
import { Card, CardHeader, CardTitle } from "@/ui/components/Card";

export default async function LocationLayout(
  props: PropsWithChildren<{
    params: Promise<{ room: string; location: string }>;
  }>,
) {
  const params = await props.params;
  const { children } = props;

  return (
    <div className="flex flex-col h-full @container-[size]">
      <div className="p-0 @h-24:px-2 @h-24:pt-2">
        <Card>
          <CardHeader className="p-2 @h-24:p-6 @h-24:py-4 items-center text-center">
            <CardTitle className="text-xl @h-24:text-2xl">
              {params.location
                ? `${params.location} is now selected`
                : "No location is selected"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex-1 w-full overflow-auto">{children}</div>
    </div>
  );
}
