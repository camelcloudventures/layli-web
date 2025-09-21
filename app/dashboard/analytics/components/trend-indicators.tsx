"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

interface TrendIndicator {
  label: string;
  value: number;
  color: "green" | "red";
}

interface TrendIndicatorsProps {
  trends: TrendIndicator[];
}

export default function TrendIndicators({ trends }: TrendIndicatorsProps) {
  if (!trends || trends.length === 0) {
    return null;
  }

  const getTrendIcon = (trend: TrendIndicator) => {
    if (trend.value > 0)
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend.value < 0)
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getBorderColor = (trend: TrendIndicator) => {
    if (trend.value > 0) return "border-l-green-500";
    if (trend.value < 0) return "border-l-red-500";
    return "border-l-gray-300";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {trends.map((trend, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-l-4 ${getBorderColor(
              trend
            )} hover:shadow-md transition-shadow duration-200`}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTrendIcon(trend)}
                  <span className="text-sm font-medium text-gray-600">
                    {trend.label}
                  </span>
                </div>
                <motion.span
                  className={`text-sm font-semibold ${
                    trend.color === "green" ? "text-green-600" : "text-red-600"
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}%
                </motion.span>
              </div>
              <p className="text-xs text-gray-500 mt-1">from previous period</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
