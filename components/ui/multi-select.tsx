"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MultiSelectProps {
  name: string;
  required?: boolean;
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  className?: string;
}

export function MultiSelect({
  name,
  required,
  value,
  onValueChange,
  placeholder,
  options,
  className,
}: MultiSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <Select
        name={name}
        required={required}
        value={value[0] || ""} // Use first value for the select
        onValueChange={(newValue) => {
          if (!newValue) return;
          const newValues = value.includes(newValue)
            ? value.filter((v) => v !== newValue)
            : [...value, newValue];
          onValueChange(newValues);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder}>
            {value.length > 0
              ? `${value.length} User${value.length > 1 ? "s" : ""} selected`
              : placeholder}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={`hover:bg-gray-100 cursor-pointer ${
                value.includes(option.value) ? "bg-gray-100" : ""
              }`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border rounded-md shadow-sm z-10">
          <div className="flex flex-wrap gap-1">
            {value.map((val, index) => {
              const option = options.find((o) => o.value === val);
              return (
                option && (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                  >
                    <span>{option.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onValueChange(value.filter((v) => v !== val))
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>
                )
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
