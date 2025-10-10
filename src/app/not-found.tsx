"use client";

import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/Card";
import { Icon } from "@/ui/components/Icon";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-6">
            <Icon variant="orange" size="lg" iconKey="search" />
          </div>
          <CardTitle className="text-4xl font-extrabold mb-2">
            Page Not Found
          </CardTitle>
          <p className="text-lg text-text-main/80 font-medium">
            Oops! The page you're looking for doesn't exist.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-base text-text-main/70 mb-6">
            The page you're looking for might have been moved, deleted, or you
            may have entered the wrong address.
          </p>

          <div className="flex flex-col gap-3 items-center">
            <Link href="/">
              <Button
                variant="primary"
                size="default"
                className="flex items-center"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            </Link>

            <Button
              variant="secondary"
              size="default"
              onClick={() => window.history.back()}
              className="flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
