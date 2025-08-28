"use client";

import { Action } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AttachedActionProps {
  action: Action;
}

export function AttachedAction({ action }: AttachedActionProps) {
  console.log("---------Att");
  return (
    <Card className="mt-4 bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg">Attached Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Title:</strong> {action.title}
          </p>
          <p>
            <strong>Status:</strong> <Badge>{action.status}</Badge>
          </p>
          <p>
            <strong>Priority:</strong> <Badge>{action.priority}</Badge>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
