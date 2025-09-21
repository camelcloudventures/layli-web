"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: string;
  onRetry?: () => void;
}

export default function ErrorBoundary({ error, onRetry }: ErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-gray-900">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We encountered an error while loading your analytics data.
          </p>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700 font-mono">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button onClick={onRetry} className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
