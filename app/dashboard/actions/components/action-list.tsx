"use client";

import { DataTable } from "@/components/custom/data-table";
import { Action } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ActionListSkeleton } from "./action-list-skeleton";

interface ActionListProps {
  actions: Action[];
  columns: ColumnDef<Action>[];
  isLoading: boolean;
}

export function ActionList({ actions, columns, isLoading }: ActionListProps) {
  if (isLoading) {
    return <ActionListSkeleton />;
  }
  return <DataTable columns={columns} data={actions} border />;
}
