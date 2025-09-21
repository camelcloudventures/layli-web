"use client";

import { ReactNode } from "react";

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
}

export default function ResponsiveGrid({
  children,
  className = "",
}: ResponsiveGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function ResponsiveGrid2({
  children,
  className = "",
}: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
}

export function ResponsiveGrid3({
  children,
  className = "",
}: ResponsiveGridProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  );
}
