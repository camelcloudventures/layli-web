"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import type { Inspection } from "@/lib/types/inspection-types";

interface OverdueInspectionsListProps {
  data: Inspection[] | null;
  isLoading?: boolean;
}

export function OverdueInspectionsList({
  data,
  isLoading,
}: OverdueInspectionsListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overdue Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Overdue Inspections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No overdue inspections
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort by due date, oldest first
  const sortedData = [...data].sort((a, b) => {
    const dateA = a.due_date ? new Date(a.due_date).getTime() : 0;
    const dateB = b.due_date ? new Date(b.due_date).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overdue Inspections</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Inspection Name</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Overdue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((inspection) => {
              const assigneeName = inspection.assignees?.[0]?.full_name;
              const dueDate = inspection.due_date
                ? new Date(inspection.due_date)
                : null;
              const daysOverdue = dueDate
                ? Math.max(0, differenceInDays(new Date(), dueDate))
                : 0;

              return (
                <TableRow key={inspection.id}>
                  <TableCell className="font-medium">
                    {inspection.title}
                  </TableCell>
                  <TableCell>
                    {assigneeName || (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {dueDate ? format(dueDate, "MMM d, yyyy") : "No due date"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{daysOverdue} days</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
