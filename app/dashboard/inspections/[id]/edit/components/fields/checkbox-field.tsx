"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFieldProps {
  question: {
    id: number;
    text: string;
    response_options: { id: number; label: string }[];
  };
  onResponse: (value: string[], files?: File[]) => void;
  response: {
    selected_options: number[];
  };
  isDisabled: boolean;
}

export function CheckboxField({
  question,
  onResponse,
  response,
  isDisabled,
}: CheckboxFieldProps) {
  const handleCheckboxChange = (optionId: number) => {
    const currentSelection = response?.selected_options || [];
    const newSelection = currentSelection.includes(optionId)
      ? currentSelection.filter((id) => id !== optionId)
      : [...currentSelection, optionId];

    onResponse(newSelection.map(String));
  };

  return (
    <div className="space-y-2">
      <Label>{question.text}</Label>
      <div className="space-y-2">
        {question.response_options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${question.id}-${option.id}`}
              checked={response?.selected_options?.includes(option.id)}
              onCheckedChange={() => handleCheckboxChange(option.id)}
              disabled={isDisabled}
            />
            <Label htmlFor={`${question.id}-${option.id}`}>
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
