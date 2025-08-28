import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div className="rounded-lg border  text-card-foreground">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
        <h3 className="text-sm font-medium">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <div className="p-6 pt-0">
        <div className="text-2xl font-bold ">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p
            className={`text-xs ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </p>
        )}
      </div>
    </div>
  );
}
