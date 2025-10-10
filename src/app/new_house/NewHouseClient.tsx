"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/ui/components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/Card";
import { createHouse } from "./actions";
import LayoutOptionCard from "./LayoutOptionCard";
import type { LayoutOption } from "./layoutService";

function SubmitButton({
  selectedLayout,
  houseName,
  success,
}: {
  selectedLayout: string | null;
  houseName: string;
  success?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={!selectedLayout || !houseName.trim() || pending || success}
      size="lg"
    >
      {success
        ? "Redirecting..."
        : pending
          ? "Creating House..."
          : "Create House"}
    </Button>
  );
}

interface NewHouseClientProps {
  layoutOptions: LayoutOption[];
}

type FormState = {
  error?: string;
  success?: boolean;
};

export default function NewHouseClient({ layoutOptions }: NewHouseClientProps) {
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [houseName, setHouseName] = useState("");
  const [state, formAction] = useActionState(createHouse, {} as FormState);
  const router = useRouter();

  // Handle client-side redirect on success
  useEffect(() => {
    if (state?.success) {
      router.push("/house_layout");
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your House
          </h1>
          <p className="text-xl text-gray-600">
            Choose a layout type to get started organizing your space
          </p>
        </div>

        <form action={formAction}>
          <input type="hidden" name="layoutType" value={selectedLayout || ""} />
          <input type="hidden" name="houseName" value={houseName} />

          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>House Name</CardTitle>
                <CardDescription>Give your house a name</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="text"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  placeholder="e.g., My Home, Downtown Apartment, etc."
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {layoutOptions.map((option) => (
              <LayoutOptionCard
                key={option.id}
                option={option}
                layoutId={option.id}
                isSelected={selectedLayout === option.id}
                onClick={() => setSelectedLayout(option.id)}
              />
            ))}
          </div>

          {state?.error && (
            <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {state.error}
            </div>
          )}

          <div className="text-center">
            <SubmitButton
              selectedLayout={selectedLayout}
              houseName={houseName}
              success={state?.success}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
