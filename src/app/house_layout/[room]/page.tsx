import type React from "react";
import { Card, CardHeader, CardTitle } from "@/ui/components/Card";

export default function Page(): React.JSX.Element {
  return (
    <div className="p-0 @h-24:px-2 @h-24:pt-2 p-2">
      <Card>
        <CardHeader className="p-2 @h-24:p-6 @h-24:py-4 items-center text-center">
          <CardTitle className="text-xl @h-24:text-2xl">
            Please select a location to view its contents
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
