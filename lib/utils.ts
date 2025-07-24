import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDate = (date: string | number | any) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: "2-digit",
    year: "numeric",
  });
};


export function capsFirstLetter(text: string) {
  return text?.charAt(0)?.toUpperCase() + text?.slice(1);
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatDateWithTime(date: string | number | any) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
} 