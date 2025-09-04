import React from "react";
import { Card, CardHeader, CardTitle } from "@/ui/components/card";

export default function Page(): React.JSX.Element {
  return (
    <div className="px-2 pt-2">
      <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
        <CardHeader className="py-4 items-center text-center">
          <CardTitle>
          Please select a location to view its contents
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
