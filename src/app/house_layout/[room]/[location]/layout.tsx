import React, { PropsWithChildren } from "react";
import { Card, CardHeader, CardTitle } from "@/ui/components/card";

export default async function LocationLayout(
  props: PropsWithChildren<{ params: Promise<{ room: string; location: string }> }>
) {
  const params = await props.params;
  const { children } = props;

  return (
    <div className="flex flex-col h-full">
      <div className="px-2 pt-2">
        <Card className="hover:scale-100 hover:[&>div]:scale-100 hover:[&>div]:shadow-none">
          <CardHeader className="py-4 items-center text-center">
            <CardTitle>
              {params.location ? `${params.location} is now selected` : "No location is selected"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

